import { Schema, model, Types } from 'mongoose';
import { invoiceStatus, invoiceRecurring, TInvoice } from './invoice.interface';

const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    street2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    zip: { type: String },
    country: { type: String, required: true },
  },
  { _id: false }
);

export const productSchema = new Schema(
  {
    product_id: { type: Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

export const serviceSchema = new Schema(
  {
    service_id: { type: Types.ObjectId, ref: 'Service' },
    quantity: { type: Number },
    rate: { type: Number },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    amount: { type: Number },
  },
  { _id: false }
);

const invoiceSchema = new Schema<TInvoice>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    warehouse_id: { type: Schema.Types.ObjectId, required: true, ref: 'Warehouse' },
    invoice_number: { type: String },
    currency: { type: String },
    date: { type: Date },
    due_date: { type: Date, required: true },
    sub_title: { type: String },
    po: { type: Schema.Types.Mixed },
    recipient_name: { type: String },
    shipping_method: { type: String },
    salesperson: { type: Schema.Types.ObjectId, ref: 'Salesperson' },
    recurring: { type: String, enum: invoiceRecurring, default: 'Never' },
    payment_method: [{ type: String }],
    discount_before_tax: { type: Number, default: 0 },
    billing_address: { type: addressSchema },
    shipping_address: { type: addressSchema },
    product:  [productSchema] ,
    service: [serviceSchema],
    terms_and_conditions: { type: String },
    notes: { type: String },
    internal_notes: { type: String },
    Attachment: { type: String },
    status: { type: String, enum: invoiceStatus, default: 'Draft' },
    sub_total: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shipping_cost: { type: Number, default: 0 },
    inline_discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paid_amount: { type: Number, default: 0 },
    balance_amount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    archive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const InvoiceModel = model<TInvoice>('Invoice', invoiceSchema);
