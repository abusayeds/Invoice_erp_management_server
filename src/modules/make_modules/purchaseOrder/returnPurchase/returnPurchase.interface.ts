import { Types } from "mongoose";

export const returnReasons = [
  "Defective",
  "Wrong Item",
  "Damaged",
  "Excess Quantity",
  "Other",
] as const;

export type ReturnReason = (typeof returnReasons)[number];

export type TReturnPurchase = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  purchase_order_id: Types.ObjectId;
  warehouse_id: Types.ObjectId;
  return_date: Date;
  return_reason: ReturnReason;
  notes?: string;
  status?: string;
  isDeleted: boolean;
  archive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
