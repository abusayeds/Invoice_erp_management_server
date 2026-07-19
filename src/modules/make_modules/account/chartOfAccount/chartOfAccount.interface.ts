import { Types } from "mongoose";
import { TNormalBalance } from "../accountType/accountType.interface";

export type TChartOfAccount = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  account_code: string;
  account_name: string;
  level?: number;
  normal_balance: TNormalBalance;
  opening_balance?: number;
  current_balance?: number;
  is_active: boolean;
  is_system_account?: boolean;
  description?: string;
  account_type_id?: Types.ObjectId;
  parent_account_id?: Types.ObjectId;
  isDeleted?: boolean;
};
