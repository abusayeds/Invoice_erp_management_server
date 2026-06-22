import { Types } from "mongoose";

export interface TTicketCategory {
  _id?: string;
  user_id?: Types.ObjectId;
  name: string;
  color?: string;
  isDeleted?: boolean;
}
