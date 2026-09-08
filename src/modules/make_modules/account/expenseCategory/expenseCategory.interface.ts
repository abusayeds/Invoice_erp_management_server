import { Types } from "mongoose";

export type TExpenseCategory = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  category_name: string;
  category_code: string;
  description?: string;
  is_active: boolean;
  gl_account_id?: Types.ObjectId;
  isDeleted?: boolean;
};
