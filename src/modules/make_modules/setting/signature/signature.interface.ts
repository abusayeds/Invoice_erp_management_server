import { Types } from "mongoose";

export interface TSignature {
  _id?: string;
  user_id?: Types.ObjectId;
  name: string;
  image?: string;
  isDeleted?: boolean;
}
