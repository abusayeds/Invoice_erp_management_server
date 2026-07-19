import { Types } from "mongoose";

export type TBankAccount = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  account_number: string;
  account_name: string;
  bank_name: string;
  branch_name?: string;
  account_type: string;
  opening_balance: number;
  current_balance: number;
  iban?: string;
  swift_code?: string;
  routing_number?: string;
  is_active: boolean;
  gl_account_id?: Types.ObjectId;
  isDeleted?: boolean;
};
