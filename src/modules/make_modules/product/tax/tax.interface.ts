import { Types } from "mongoose";

export interface TTax {
  _id?: string;
  user_id?: Types.ObjectId;
  name: string;
  rate: number;
}
