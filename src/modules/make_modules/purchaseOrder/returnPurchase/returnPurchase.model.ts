import { Schema, model } from "mongoose";
import { TReturnPurchase, returnReasons } from "./returnPurchase.interface";

const returnPurchaseSchema = new Schema<TReturnPurchase>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    purchase_order_id: {
      type: Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      required: true,
    },
    warehouse_id: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    return_date: { type: Date, required: true },
    return_reason: { type: String, enum: returnReasons, required: true },
    notes: { type: String },
    status: { type: String, default: "Returned" },
    isDeleted: { type: Boolean, default: false },
    archive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ReturnPurchaseModel = model<TReturnPurchase>(
  "ReturnPurchase",
  returnPurchaseSchema
);
