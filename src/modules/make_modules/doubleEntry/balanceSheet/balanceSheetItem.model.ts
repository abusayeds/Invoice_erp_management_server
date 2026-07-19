import { Schema, model } from "mongoose";
import { TBalanceSheetItem } from "../doubleEntry.types";

const schema = new Schema<TBalanceSheetItem>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    balance_sheet_id: { type: Schema.Types.ObjectId, ref: "BalanceSheet", required: true },
    account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount", required: true },
    section_type: { type: String, required: true, trim: true },
    sub_section: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BalanceSheetItemModel = model<TBalanceSheetItem>("BalanceSheetItem", schema);
