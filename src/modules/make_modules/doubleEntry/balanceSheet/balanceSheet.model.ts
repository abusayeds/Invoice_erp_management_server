import { Schema, model } from "mongoose";
import { balanceSheetStatuses, TBalanceSheet } from "../doubleEntry.types";

const schema = new Schema<TBalanceSheet>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    balance_sheet_date: { type: Date, required: true },
    financial_year: { type: String, required: true, trim: true },
    total_assets: { type: Number, default: 0 },
    total_liabilities: { type: Number, default: 0 },
    total_equity: { type: Number, default: 0 },
    is_balanced: { type: Boolean, default: false },
    status: { type: String, enum: balanceSheetStatuses, default: "draft" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BalanceSheetModel = model<TBalanceSheet>("BalanceSheet", schema);
