import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { PurchaseReturnModel } from "./purchaseReturn.model";
import { PurchaseInvoiceModel } from "../purchaseInvoice/purchaseInvoice.model";
import { WarehouseModel } from "../warehouse/warehouse.model";
import { computeTotals, generateDocNumber, RawItem } from "../purchase.utils";
import { createDebitNoteFromPurchaseReturn } from "../../account/noteFromReturn.service";

const POPULATE = [
  { path: "vendor_id", select: "name email" },
  { path: "warehouse_id", select: "name city" },
  { path: "original_invoice_id", select: "invoice_number total_amount status" },
  { path: "items.product_id", select: "productName sku" },
];

const createDB = async (userId: string, body: Record<string, unknown>) => {
  if (!body.original_invoice_id || !Types.ObjectId.isValid(String(body.original_invoice_id))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Valid original invoice is required");
  }
  const originalInvoice = await PurchaseInvoiceModel.findOne({
    _id: body.original_invoice_id,
    user_id: userId,
    isDeleted: false,
  });
  if (!originalInvoice) {
    throw new AppError(httpStatus.NOT_FOUND, "Original purchase invoice not found");
  }
  if (originalInvoice.status === "draft") {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot return against a draft invoice");
  }

  if (body.warehouse_id) {
    const wh = await WarehouseModel.findOne({ _id: body.warehouse_id, user_id: userId, isDeleted: false });
    if (!wh) throw new AppError(httpStatus.BAD_REQUEST, "Warehouse not found in your company");
  }

  const rawItems = (body.items as RawItem[]) || [];
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "At least one return item is required");
  }

  // Pull discount/tax % from the matching original invoice item (Laravel calculateReturnTotals).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const origItems = originalInvoice.items as any[];
  const origMap = new Map(origItems.map((it) => [String(it._id), it]));
  const enriched = rawItems.map((it) => {
    const orig = it.original_invoice_item_id ? origMap.get(String(it.original_invoice_item_id)) : undefined;
    return {
      ...it,
      unit_price: Number(it.unit_price ?? orig?.unit_price ?? 0),
      discount_percentage: Number(orig?.discount_percentage ?? it.discount_percentage ?? 0),
      tax_percentage: Number(orig?.tax_percentage ?? it.tax_percentage ?? 0),
      original_quantity: Number(orig?.quantity ?? it.original_quantity ?? 0),
    };
  });

  const totals = computeTotals(enriched, "return_quantity");
  const return_number = await generateDocNumber(PurchaseReturnModel, userId, "PR", "return_number");

  const created = await PurchaseReturnModel.create({
    return_number,
    return_date: body.return_date,
    vendor_id: body.vendor_id ?? originalInvoice.vendor_id,
    warehouse_id: body.warehouse_id ?? originalInvoice.warehouse_id,
    original_invoice_id: originalInvoice._id,
    reason: body.reason,
    notes: body.notes,
    items: totals.items,
    subtotal: totals.subtotal,
    tax_amount: totals.tax_amount,
    discount_amount: totals.discount_amount,
    total_amount: totals.total_amount,
    status: "draft",
    user_id: new Types.ObjectId(userId),
    isDeleted: false,
  });
  return created.populate(POPULATE);
};

const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const base = { user_id: userId, isDeleted: false };
  const qb = new queryBuilder(PurchaseReturnModel.find(base).populate(POPULATE), query)
    .search(["return_number", "notes"])
    .filter()
    .sort()
    .fields();
  const { totalData } = await qb.paginate(PurchaseReturnModel.find(base));
  const data = await qb.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const pagination = qb.calculatePagination({ totalData, currentPage, limit });
  return { data, pagination };
};

const getSingleDB = async (userId: string, id: string) => {
  const doc = await PurchaseReturnModel.findOne({ _id: id, user_id: userId, isDeleted: false }).populate(POPULATE);
  if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Purchase return not found");
  return doc;
};

/** Laravel approve(): only a draft return can be approved → auto draft debit note. */
const approveDB = async (userId: string, id: string) => {
  const purchaseReturn = await PurchaseReturnModel.findOne({ _id: id, user_id: userId, isDeleted: false });
  if (!purchaseReturn) throw new AppError(httpStatus.NOT_FOUND, "Purchase return not found");
  if (purchaseReturn.status !== "draft") {
    throw new AppError(httpStatus.BAD_REQUEST, "Only draft returns can be approved");
  }

  const debitNote = await createDebitNoteFromPurchaseReturn(userId, purchaseReturn);
  purchaseReturn.status = "approved";
  purchaseReturn.debit_note_id = debitNote._id as Types.ObjectId;
  await purchaseReturn.save();
  return { purchaseReturn: await purchaseReturn.populate(POPULATE), debitNote };
};

/** Laravel complete(): only an approved return can be completed. */
const completeDB = async (userId: string, id: string) => {
  const purchaseReturn = await PurchaseReturnModel.findOne({ _id: id, user_id: userId, isDeleted: false });
  if (!purchaseReturn) throw new AppError(httpStatus.NOT_FOUND, "Purchase return not found");
  if (purchaseReturn.status !== "approved") {
    throw new AppError(httpStatus.BAD_REQUEST, "Only approved returns can be completed");
  }
  purchaseReturn.status = "completed";
  await purchaseReturn.save();
  return purchaseReturn.populate(POPULATE);
};

/** Laravel destroy(): only a draft return can be deleted. */
const removeDB = async (userId: string, id: string) => {
  const purchaseReturn = await PurchaseReturnModel.findOne({ _id: id, user_id: userId, isDeleted: false });
  if (!purchaseReturn) throw new AppError(httpStatus.NOT_FOUND, "Purchase return not found");
  if (purchaseReturn.status !== "draft") {
    throw new AppError(httpStatus.BAD_REQUEST, "Only draft returns can be deleted");
  }
  purchaseReturn.isDeleted = true;
  await purchaseReturn.save();
  return { _id: id };
};

export const purchaseReturnService = {
  createDB,
  getAllDB,
  getSingleDB,
  approveDB,
  completeDB,
  removeDB,
};
