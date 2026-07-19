import { Types } from "mongoose";

export type TOnboardingChecklist = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  description?: string;
  is_default: boolean;
  status: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
