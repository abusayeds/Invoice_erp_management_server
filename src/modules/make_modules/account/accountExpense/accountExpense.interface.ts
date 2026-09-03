import { Types } from "mongoose";

export const accountExpenseStatuses = ["draft", "approved", "posted"] as const;

export type TAccountExpense = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  expense_number?: string;
  expense_date: Date;
  category_id: Types.ObjectId;
  bank_account_id: Types.ObjectId;
  chart_of_account_id: Types.ObjectId;
  amount: number;
  description?: string;
  reference_number?: string;
  status: (typeof accountExpenseStatuses)[number];
  approved_by?: Types.ObjectId;
  isDeleted?: boolean;
};
