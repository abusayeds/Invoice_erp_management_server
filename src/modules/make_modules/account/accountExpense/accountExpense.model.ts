import { Schema, model } from "mongoose";
import { accountExpenseStatuses, TAccountExpense } from "./accountExpense.interface";

const schema = new Schema<TAccountExpense>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    expense_number: { type: String },
    expense_date: { type: Date, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: "AccountExpenseCategory", required: true },
    bank_account_id: { type: Schema.Types.ObjectId, ref: "AccountBankAccount", required: true },
    chart_of_account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount", required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    reference_number: { type: String, trim: true },
    status: { type: String, enum: accountExpenseStatuses, default: "draft" },
    approved_by: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AccountExpenseModel = model<TAccountExpense>("AccountExpense", schema);
