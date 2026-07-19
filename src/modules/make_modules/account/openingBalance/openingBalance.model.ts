import { Schema, model } from "mongoose";
import { openingBalanceTypes, TOpeningBalance } from "./openingBalance.interface";

const schema = new Schema<TOpeningBalance>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount", required: true },
    financial_year: { type: String, required: true, trim: true },
    opening_balance: { type: Number, default: 0 },
    balance_type: { type: String, enum: openingBalanceTypes, required: true },
    effective_date: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ user_id: 1, account_id: 1, financial_year: 1 }, { unique: true });

export const OpeningBalanceModel = model<TOpeningBalance>("OpeningBalance", schema);
