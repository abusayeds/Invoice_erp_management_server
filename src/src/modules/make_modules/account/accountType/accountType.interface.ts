import { Types } from "mongoose";

export const normalBalanceValues = ["debit", "credit"] as const;
export type TNormalBalance = (typeof normalBalanceValues)[number];

export type TAccountType = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  category_id: Types.ObjectId;
  name: string;
  code: string;
  normal_balance: TNormalBalance;
  description?: string;
  is_active: boolean;
  is_system_type?: boolean;
  isDeleted?: boolean;
};
