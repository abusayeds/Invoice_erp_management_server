import { Schema, model, Types } from "mongoose";
import { TPurchaseInvoice, purchaseInvoiceStatus } from "./purchaseInvoice.interface";

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
    quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
    discount_percentage: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    tax_percentage: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    total_amount: { type: Number, default: 0 },
    taxes: { type: [itemTaxSchema], default: [] },
  }
  // keep _id on items so purchase returns can reference original_invoice_item_id
);

const purchaseInvoiceSchema = new Schema<TPurchaseInvoice>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    invoice_number: { type: String },
    invoice_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    warehouse_id: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    items: { type: [itemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    total_amount: { type: Number, default: 0 },
    paid_amount: { type: Number, default: 0 },
    debit_note_applied: { type: Number, default: 0 },
    balance_amount: { type: Number, default: 0 },
    status: { type: String, enum: purchaseInvoiceStatus, default: "draft" },
    payment_terms: { type: String },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PurchaseInvoiceModel = model<TPurchaseInvoice>(
  "PurchaseInvoice",
  purchaseInvoiceSchema
);
