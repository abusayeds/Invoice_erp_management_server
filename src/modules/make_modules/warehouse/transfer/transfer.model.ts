import { Schema, model } from "mongoose";
import { TStockTransfer } from "./transfer.interface";

const stockTransferSchema = new Schema<TStockTransfer>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    from_warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
    to_warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
    quantity: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const StockTransferModel = model<TStockTransfer>(
  "StockTransfer",
  stockTransferSchema
);
