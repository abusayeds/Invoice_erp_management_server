import { Schema, model, Types } from "mongoose";
import {
  TPurchaseReturn,
  purchaseReturnReasons,
  purchaseReturnStatus,
} from "./purchaseReturn.interface";

const itemTaxSchema = new Schema(
  {
    tax_name: { type: String, required: true },
    tax_rate: { type: Number, default: 0 },
  },
  { _id: false }
);

const itemSchema = new Schema(
  {
    product_id: { type: Types.ObjectId, ref: "Product", required: true },
    original_invoice_item_id: { type: Types.ObjectId },
    original_quantity: { type: Number, default: 0 },
    return_quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
    discount_percentage: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    tax_percentage: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    total_amount: { type: Number, default: 0 },
    reason: { type: String },
    taxes: { type: [itemTaxSchema], default: [] },
  },
  { _id: false }
);

const purchaseReturnSchema = new Schema<TPurchaseReturn>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    return_number: { type: String },
    return_date: { type: Date, required: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    warehouse_id: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    original_invoice_id: { type: Schema.Types.ObjectId, ref: "PurchaseInvoice", required: true },
    reason: { type: String, enum: purchaseReturnReasons, default: "defective" },
    items: { type: [itemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    total_amount: { type: Number, default: 0 },
    status: { type: String, enum: purchaseReturnStatus, default: "draft" },
    notes: { type: String },
    debit_note_id: { type: Schema.Types.ObjectId, ref: "DebitNote" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PurchaseReturnModel = model<TPurchaseReturn>("PurchaseReturn", purchaseReturnSchema);
