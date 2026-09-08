import { Types } from "mongoose";

export type TJobType = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  description?: string;
  is_active: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
