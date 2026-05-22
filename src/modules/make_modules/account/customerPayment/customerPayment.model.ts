import { Schema, model } from "mongoose";
import { paymentStatuses, TCustomerPayment } from "./customerPayment.interface";

const allocationSchema = new Schema(
  {
    invoice_id: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    allocated_amount: { type: Number, required: true, min: 0.01 },
  },
  { _id: true }
);

const creditNoteAppSchema = new Schema(
  {
    credit_note_id: { type: Schema.Types.ObjectId, ref: "CreditNote", required: true },
    applied_amount: { type: Number, required: true, min: 0.01 },
  },
  { _id: true }
);

const schema = new Schema<TCustomerPayment>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    payment_number: { type: String },
    payment_date: { type: Date, required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bank_account_id: { type: Schema.Types.ObjectId, ref: "AccountBankAccount", required: true },
    reference_number: { type: String, trim: true },
    payment_amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: paymentStatuses, default: "pending" },
    notes: { type: String, trim: true },
    allocations: [allocationSchema],
    credit_notes: [creditNoteAppSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CustomerPaymentModel = model<TCustomerPayment>("AccountCustomerPayment", schema);
