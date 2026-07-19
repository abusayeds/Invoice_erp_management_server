import { Schema, model } from "mongoose";
import {
  reconciliationStatuses,
  TBankTransaction,
  transactionStatuses,
  transactionTypes,
} from "./bankTransaction.interface";

const schema = new Schema<TBankTransaction>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    bank_account_id: { type: Schema.Types.ObjectId, ref: "AccountBankAccount", required: true },
    transaction_date: { type: Date, required: true },
    transaction_type: { type: String, enum: transactionTypes, required: true },
    reference_number: { type: String, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true },
    running_balance: { type: Number, default: 0 },
    transaction_status: { type: String, enum: transactionStatuses, default: "cleared" },
    reconciliation_status: { type: String, enum: reconciliationStatuses, default: "unreconciled" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BankTransactionModel = model<TBankTransaction>("AccountBankTransaction", schema);
