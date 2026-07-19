import { Schema, model } from "mongoose";
import { TBankAccount } from "./bankAccount.interface";

const bankAccountSchema = new Schema<TBankAccount>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    account_number: { type: String, required: true, trim: true },
    account_name: { type: String, required: true, trim: true },
    bank_name: { type: String, required: true, trim: true },
    branch_name: { type: String, trim: true },
    account_type: { type: String, required: true },
    opening_balance: { type: Number, default: 0 },
    current_balance: { type: Number, default: 0 },
    iban: { type: String, trim: true },
    swift_code: { type: String, trim: true },
    routing_number: { type: String, trim: true },
    is_active: { type: Boolean, default: true },
    gl_account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bankAccountSchema.index({ user_id: 1, account_number: 1 }, { unique: true });

export const BankAccountModel = model<TBankAccount>("AccountBankAccount", bankAccountSchema);
