import { Types } from "mongoose";

export interface TPaymentMethod {
  _id?: string;
  user_id?: Types.ObjectId;
  name: string;
  logo?: string;
  isDeleted?: boolean;
}
