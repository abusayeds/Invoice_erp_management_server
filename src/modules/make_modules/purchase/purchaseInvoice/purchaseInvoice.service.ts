import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { CLIENT_POPULATE_SELECT } from "../../../../utils/partyUser";
import { validateDocumentParties } from "../../../../utils/documentPartyValidation";
import { ProductModel } from "../../product/product.model";
import { ServiceModel } from "../../service/service.model";
import { TProduct } from "../../product/product.interface";
import { TService } from "../../service/service.interface";
import { calculateInvoice } from "../../utils/calculateInvoice";
import { validateItemAmount } from "../../utils/validateItemAmount";
import { WarehouseModel } from "../warehouse/warehouse.model";
import { PurchaseInvoiceModel } from "./purchaseInvoice.model";
import { TPurchaseInvoice } from "./purchaseInvoice.interface";
import { generateDocNumber, round2 } from "../purchase.utils";
import { withBulkDeleteIdSecond } from "../../../../utils/bulkDelete";

const POPULATE = [
  { path: "vendor_id", select: CLIENT_POPULATE_SELECT },
  { path: "warehouse_id", select: "name address city" },
  { path: "product.product_id", select: "productName sku" },
  { path: "service.service_id", select: "name" },
];

const normalizeBody = (body: Record<string, unknown>): Record<string, unknown> => {
  const payload = { ...body };
  if (payload.date === undefined && payload.invoice_date !== undefined) {
    payload.date = payload.invoice_date;
  }
  delete payload.invoice_date;
  return payload;
};

const assertWarehouse = async (warehouseId: unknown, userId: string) => {
  if (warehouseId === undefined || warehouseId === null || warehouseId === "") return;
  if (!Types.ObjectId.isValid(String(warehouseId))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Valid warehouse is required");
  }
  const wh = await WarehouseModel.findOne({ _id: warehouseId, user_id: userId, isDeleted: false });
  if (!wh) throw new AppError(httpStatus.BAD_REQUEST, "Warehouse not found in your company");
};

const validateLineItems = async (payload: TPurchaseInvoice) => {
  const hasProduct = Array.isArray(payload.product) && payload.product.length > 0;
  const hasService = Array.isArray(payload.service) && payload.service.length > 0;
  if (!hasProduct && !hasService) {
    throw new AppError(httpStatus.BAD_REQUEST, "At least one product or service is required");
  }

  if (Array.isArray(payload.product)) {
    for (const item of payload.product) {
      const product = (await ProductModel.findById(item.product_id)) as TProduct;
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found with id: " + item.product_id);
      }
      const buyRate = product.pricing?.buyPrice ?? 0;
      if (buyRate !== item.rate) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Product rate mismatch " + item.product_id + ": " + buyRate + " vs " + item.rate
        );
      }
      validateItemAmount(item, "product");
    }
  }

  if (Array.isArray(payload.service)) {
    for (const item of payload.service) {
      const service = (await ServiceModel.findById(item.service_id)) as TService;
      if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found with id: " + item.service_id);
      }
      if (service.rate !== item.rate) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Service rate mismatch " + item.service_id + ": " + service.rate + " vs " + item.rate
        );
      }
      validateItemAmount(item, "service");
    }
  }
};

const buildDocument = async (userId: string, body: Record<string, unknown>) => {
  const payload = normalizeBody(body) as TPurchaseInvoice;
  if (!payload.vendor_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Vendor is required");
  }
  await validateDocumentParties({ vendor_id: payload.vendor_id });
  await assertWarehouse(payload.warehouse_id, userId);
  await validateLineItems(payload);
  const totals = await calculateInvoice(payload);
  return { ...payload, ...totals };
};

const createDB = async (userId: string, body: Record<string, unknown>) => {
  const data = await buildDocument(userId, body);
  const invoice_number = await generateDocNumber(
    PurchaseInvoiceModel,
    userId,
    "PI",
    "invoice_number"
  );
  const created = await PurchaseInvoiceModel.create({
    ...data,
    user_id: new Types.ObjectId(userId),
    invoice_number,
    paid_amount: 0,
    debit_note_applied: 0,
    balance_amount: data.total ?? 0,
    status: "draft",
    isArchive: false,
    isDeleted: false,
  });
  return created.populate(POPULATE);
};

const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const base = { user_id: userId, isArchive: false, isDeleted: false };
  const qb = new queryBuilder(PurchaseInvoiceModel.find(base).populate(POPULATE), query)
    .search([
      "internal_notes",
      "notes",
      "terms_and_conditions",
      "invoice_number",
      "sub_title",
      "payment_terms",
    ])
    .filter()
    .sort()
    .fields();
  const { totalData } = await qb.paginate(PurchaseInvoiceModel.find(base));
  const data = await qb.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const pagination = qb.calculatePagination({ totalData, currentPage, limit });
  return { data, pagination };
};

const getSingleDB = async (userId: string, id: string) => {
  const doc = await PurchaseInvoiceModel.findOne({
    _id: id,
    user_id: userId,
    isArchive: false,
    isDeleted: false,
  }).populate(POPULATE);
  if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Purchase invoice not found");
  return doc;
};

const updateDB = async (userId: string, id: string, body: Record<string, unknown>) => {
  const existing = await PurchaseInvoiceModel.findOne({ _id: id, user_id: userId });
  if (!existing) throw new AppError(httpStatus.NOT_FOUND, "Purchase invoice not found");
  if (existing.status !== "draft") {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot update a posted invoice");
  }

  const payload = normalizeBody(body) as TPurchaseInvoice;
  await validateDocumentParties({ vendor_id: payload.vendor_id ?? existing.vendor_id });
  await assertWarehouse(payload.warehouse_id ?? existing.warehouse_id, userId);

  const recalcTotals = payload.product !== undefined || payload.service !== undefined;
  let data: Record<string, unknown> = { ...payload };

  if (recalcTotals) {
    await validateLineItems({ ...existing.toObject(), ...payload } as TPurchaseInvoice);
    const result = await calculateInvoice({ ...existing.toObject(), ...payload });
    const paid = payload.paid_amount ?? existing.paid_amount ?? 0;
    data = {
      ...payload,
      ...result,
      paid_amount: paid,
      balance_amount: Math.max(0, round2((result.total ?? 0) - paid))
    };
  }

  const updated = await PurchaseInvoiceModel.findOneAndUpdate(
    { _id: id, user_id: userId },
    { $set: data },
    { new: true, runValidators: true }
  ).populate(POPULATE);
  return updated;
};

const removeDBOne = async (userId: string, id: string) => {
  const existing = await PurchaseInvoiceModel.findOne({ _id: id, user_id: userId, isDeleted: false });
  if (!existing) throw new AppError(httpStatus.NOT_FOUND, "Purchase invoice not found");
  if (existing.status === "posted") {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete a posted invoice");
  }
  await PurchaseInvoiceModel.findOneAndUpdate({ _id: id, user_id: userId }, { isDeleted: true });
  return { _id: id };
};

/** Laravel post(): only a draft invoice can be posted. */
const postDB = async (userId: string, id: string) => {
  const existing = await PurchaseInvoiceModel.findOne({ _id: id, user_id: userId, isDeleted: false });
  if (!existing) throw new AppError(httpStatus.NOT_FOUND, "Purchase invoice not found");
  if (existing.status !== "draft") {
    throw new AppError(httpStatus.BAD_REQUEST, "Only draft invoices can be posted");
  }
  existing.status = "posted";
  await existing.save();
  return existing.populate(POPULATE);
};

const removeDB = withBulkDeleteIdSecond(removeDBOne);

export const purchaseInvoiceService = {
  createDB,
  getAllDB,
  getSingleDB,
  updateDB,
  removeDB,
  postDB,
};
