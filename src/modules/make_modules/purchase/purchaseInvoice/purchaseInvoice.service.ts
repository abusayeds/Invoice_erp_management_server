import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { ProductModel } from "../../product/product.model";
import { WarehouseModel } from "../warehouse/warehouse.model";
import { PurchaseInvoiceModel } from "./purchaseInvoice.model";
import { computeTotals, generateDocNumber, round2, RawItem } from "../purchase.utils";

const POPULATE = [
  { path: "vendor_id", select: "name email" },
  { path: "warehouse_id", select: "name address city" },
  { path: "items.product_id", select: "productName sku" },
];

const assertWarehouse = async (warehouseId: unknown, userId: string) => {
  if (warehouseId === undefined || warehouseId === null || warehouseId === "") return;
  if (!Types.ObjectId.isValid(String(warehouseId))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Valid warehouse is required");
  }
  const wh = await WarehouseModel.findOne({ _id: warehouseId, user_id: userId, isDeleted: false });
  if (!wh) throw new AppError(httpStatus.BAD_REQUEST, "Warehouse not found in your company");
};

const assertProducts = async (items: RawItem[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "At least one item is required");
  }
  for (const it of items) {
    if (!it.product_id || !Types.ObjectId.isValid(String(it.product_id))) {
      throw new AppError(httpStatus.BAD_REQUEST, "Valid product is required for each item");
    }
    const product = await ProductModel.findById(it.product_id);
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found: " + it.product_id);
    }
  }
};

const buildPayload = async (userId: string, body: Record<string, unknown>) => {
  await assertWarehouse(body.warehouse_id, userId);
  await assertProducts(body.items as RawItem[]);

  const { items, subtotal, tax_amount, discount_amount, total_amount } = computeTotals(
    body.items as RawItem[],
    "quantity"
  );

  return {
    invoice_date: body.invoice_date,
    due_date: body.due_date,
    vendor_id: body.vendor_id,
    warehouse_id: body.warehouse_id || undefined,
    payment_terms: body.payment_terms,
    notes: body.notes,
    items,
    subtotal,
    tax_amount,
    discount_amount,
    total_amount,
  };
};

const createDB = async (userId: string, body: Record<string, unknown>) => {
  const payload = await buildPayload(userId, body);
  const invoice_number = await generateDocNumber(
    PurchaseInvoiceModel,
    userId,
    "PI",
    "invoice_number"
  );
  const created = await PurchaseInvoiceModel.create({
    ...payload,
    user_id: new Types.ObjectId(userId),
    invoice_number,
    paid_amount: 0,
    debit_note_applied: 0,
    balance_amount: payload.total_amount,
    status: "draft",
    isDeleted: false,
  });
  return created.populate(POPULATE);
};

const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const base = { user_id: userId, isDeleted: false };
  const qb = new queryBuilder(PurchaseInvoiceModel.find(base).populate(POPULATE), query)
    .search(["invoice_number", "notes", "payment_terms"])
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
    isDeleted: false,
  }).populate(POPULATE);
  if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Purchase invoice not found");
  return doc;
};

const updateDB = async (userId: string, id: string, body: Record<string, unknown>) => {
  const existing = await PurchaseInvoiceModel.findOne({ _id: id, user_id: userId, isDeleted: false });
  if (!existing) throw new AppError(httpStatus.NOT_FOUND, "Purchase invoice not found");
  if (existing.status !== "draft") {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot update a posted invoice");
  }
  const payload = await buildPayload(userId, body);
  const updated = await PurchaseInvoiceModel.findOneAndUpdate(
    { _id: id, user_id: userId },
    { $set: { ...payload, balance_amount: round2(payload.total_amount - (existing.paid_amount || 0)) } },
    { new: true, runValidators: true }
  ).populate(POPULATE);
  return updated;
};

const removeDB = async (userId: string, id: string) => {
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

export const purchaseInvoiceService = {
  createDB,
  getAllDB,
  getSingleDB,
  updateDB,
  removeDB,
  postDB,
};
