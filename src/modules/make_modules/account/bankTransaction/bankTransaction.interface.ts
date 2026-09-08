import { Types } from "mongoose";

export const transactionTypes = ["credit", "debit"] as const;
export const transactionStatuses = ["pending", "cleared"] as const;
export const reconciliationStatuses = ["unreconciled", "reconciled"] as const;

export type TBankTransaction = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  bank_account_id: Types.ObjectId;
  transaction_date: Date;
  transaction_type: (typeof transactionTypes)[number];
  reference_number?: string;
  description?: string;
  amount: number;
  running_balance: number;
  transaction_status: (typeof transactionStatuses)[number];
  reconciliation_status: (typeof reconciliationStatuses)[number];
  isDeleted?: boolean;
};
