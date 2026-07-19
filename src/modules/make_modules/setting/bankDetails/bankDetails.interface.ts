import { Types } from "mongoose";

export interface TBankDetails {
  _id?: string;
  user_id?: Types.ObjectId;
  content?: string;
}
