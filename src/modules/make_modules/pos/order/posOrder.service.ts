import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { PosOrderModel, TPosOrder, TPosOrderItem } from "./posOrder.model";

const uid = (id: string) => new Types.ObjectId(id);

/** Recompute money fields from the line items so totals are authoritative. */
const computeTotals = (items: TPosOrderItem[], discount: number) => {
  const sub_total = items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.price) || 0), 0);
  const tax = +items
    .reduce((s, i) => s + ((Number(i.quantity) || 0) * (Number(i.price) || 0) * (Number(i.tax_rate) || 0)) / 100, 0)
    .toFixed(2);
  const total = +(sub_total + tax - (Number(discount) || 0)).toFixed(2);
  return { sub_total: +sub_total.toFixed(2), tax, total };
};

const createDB = async (payload: Partial<TPosOrder>) => {
  const items = (payload.items || []) as TPosOrderItem[];
  if (!items.length) throw new AppError(httpStatus.BAD_REQUEST, "A POS order needs at least one item");
  const totals = computeTotals(items, Number(payload.discount) || 0);
  const data = {
    ...payload,
    discount: Number(payload.discount) || 0,
    ...totals,
    status: payload.status || "Completed",
    isDeleted: false,
  };
  return PosOrderModel.create(data);
};

const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { user_id: uid(userId), isDeleted: { $ne: true } };
  const term = (query.searchTerm as string) ?? "";
  if (term.trim()) {
    const rx = new RegExp(term.trim(), "i");
    filter.$or = [{ order_number: rx }, { customer_name: rx }, { warehouse: rx }];
  }
  if (query.status) filter.status = query.status;
  return PosOrderModel.find(filter).sort({ createdAt: -1 }).lean();
};

const getSingleDB = async (id: string, userId: string) => {
  const record = await PosOrderModel.findOne({ _id: id, user_id: uid(userId), isDeleted: false });
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "POS order not found");
  return record;
};

const deleteDB = async (id: string, userId: string) => {
  const record = await PosOrderModel.findOne({ _id: id, user_id: uid(userId), isDeleted: false });
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "POS order not found");
  record.isDeleted = true;
  await record.save();
  return record;
};

export const posOrderService = { createDB, getAllDB, getSingleDB, deleteDB };
