import { Schema, model } from "mongoose";
import { TComparativeBalanceSheet } from "../doubleEntry.types";

const schema = new Schema<TComparativeBalanceSheet>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    current_period_id: { type: Schema.Types.ObjectId, ref: "BalanceSheet", required: true },
    previous_period_id: { type: Schema.Types.ObjectId, ref: "BalanceSheet", required: true },
    comparison_date: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ComparativeBalanceSheetModel = model<TComparativeBalanceSheet>(
  "ComparativeBalanceSheet",
  schema
);
