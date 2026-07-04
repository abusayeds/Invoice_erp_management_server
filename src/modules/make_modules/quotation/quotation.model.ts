import { Schema, model, Types } from "mongoose";
import { quotationStatus, TQuotation } from "./quotation.interface";

/** Stored totals include `sub_total` from `calculateInvoice`; not on client-facing `TQuotation`. */
type QuotationDocument = TQuotation & { sub_total?: number };

const productSchema = new Schema(
  {
    product_id: { type: Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const serviceSchema = new Schema(
  {
    service_id: { type: Types.ObjectId, ref: "Service" },
    quantity: { type: Number },
    rate: { type: Number },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    amount: { type: Number },
  },
  { _id: false }
);

const quotationSchema = new Schema<QuotationDocument>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: "User" },
    vendor_id: { type: Schema.Types.ObjectId, ref: "User" },
    warehouse_id: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    quotation_number: { type: String },
    quotation_date: { type: Date },
    due_date: { type: Date },
    discount_before_tax: { type: Number, default: 0 },
    product: [productSchema],
    service: [serviceSchema],
    status: { type: String, enum: quotationStatus, default: "Draft" },
    notes: { type: String },
    deposit: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shipping_cost: { type: Number, default: 0 },
    inline_discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    sub_total: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    isArchive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const QuotationModel = model<QuotationDocument>("Quotation", quotationSchema);
