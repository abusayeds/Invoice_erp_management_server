import { Types } from "mongoose";

export const balanceSheetStatuses = ["draft", "finalized"] as const;
export type BalanceSheetStatus = (typeof balanceSheetStatuses)[number];

export type TBalanceSheet = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  balance_sheet_date: Date;
  financial_year: string;
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  is_balanced: boolean;
  status: BalanceSheetStatus;
  isDeleted: boolean;
};

export type TBalanceSheetItem = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  balance_sheet_id: Types.ObjectId;
  account_id: Types.ObjectId;
  section_type: string;
  sub_section: string;
  amount: number;
  isDeleted: boolean;
};

export type TBalanceSheetNote = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  balance_sheet_id: Types.ObjectId;
  note_number: number;
  note_title: string;
  note_content: string;
  isDeleted: boolean;
};

export type TComparativeBalanceSheet = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  current_period_id: Types.ObjectId;
  previous_period_id: Types.ObjectId;
  comparison_date: Date;
  isDeleted: boolean;
};
