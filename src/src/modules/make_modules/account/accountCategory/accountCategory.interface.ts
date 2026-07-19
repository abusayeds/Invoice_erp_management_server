import { Types } from "mongoose";

export type TAccountCategory = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  code: string;
  type?: string;
  description?: string;
  is_active: boolean;
  isDeleted?: boolean;
};
