import { Types } from "mongoose";

export const openingBalanceTypes = ["debit", "credit"] as const;
export type OpeningBalanceType = (typeof openingBalanceTypes)[number];

export type TOpeningBalance = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  account_id: Types.ObjectId;
  financial_year: string;
  opening_balance: number;
  balance_type: OpeningBalanceType;
  effective_date: Date;
  isDeleted?: boolean;
};
