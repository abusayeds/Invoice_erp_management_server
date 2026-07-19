import { Schema, model } from "mongoose";
import { accountRevenueStatuses, TAccountRevenue } from "./accountRevenue.interface";

const schema = new Schema<TAccountRevenue>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    revenue_number: { type: String },
    revenue_date: { type: Date, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: "AccountRevenueCategory", required: true },
    bank_account_id: { type: Schema.Types.ObjectId, ref: "AccountBankAccount", required: true },
    chart_of_account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount", required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    reference_number: { type: String, trim: true },
    status: { type: String, enum: accountRevenueStatuses, default: "draft" },
    approved_by: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AccountRevenueModel = model<TAccountRevenue>("AccountRevenue", schema);
