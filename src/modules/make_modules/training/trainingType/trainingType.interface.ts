import { Types } from "mongoose";

export type TTrainingType = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  description?: string;
  branch_id?: Types.ObjectId;
  department_id?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
