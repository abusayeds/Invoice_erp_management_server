import { Schema, model } from "mongoose";
import { normalBalanceValues } from "../accountType/accountType.interface";
import { TChartOfAccount } from "./chartOfAccount.interface";

const schema = new Schema<TChartOfAccount>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    account_code: { type: String, required: true, trim: true },
    account_name: { type: String, required: true, trim: true },
    level: { type: Number, default: 1, min: 1 },
    normal_balance: { type: String, enum: normalBalanceValues, required: true },
    opening_balance: { type: Number, default: 0 },
    current_balance: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    is_system_account: { type: Boolean, default: false },
    description: { type: String, trim: true },
    account_type_id: { type: Schema.Types.ObjectId, ref: "AccountType" },
    parent_account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ user_id: 1, account_code: 1 }, { unique: true });

export const ChartOfAccountModel = model<TChartOfAccount>("AccountChartOfAccount", schema);
