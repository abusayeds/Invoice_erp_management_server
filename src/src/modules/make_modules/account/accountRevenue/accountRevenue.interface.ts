import { Types } from "mongoose";

export const accountRevenueStatuses = ["draft", "approved", "posted"] as const;

export type TAccountRevenue = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  revenue_number?: string;
  revenue_date: Date;
  category_id: Types.ObjectId;
  bank_account_id: Types.ObjectId;
  chart_of_account_id: Types.ObjectId;
  amount: number;
  description?: string;
  reference_number?: string;
  status: (typeof accountRevenueStatuses)[number];
  approved_by?: Types.ObjectId;
  isDeleted?: boolean;
};
