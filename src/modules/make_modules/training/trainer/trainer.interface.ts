import { Types } from "mongoose";

export type TTrainer = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  contact: string;
  email: string;
  experience: string;
  branch_id?: Types.ObjectId;
  department_id?: Types.ObjectId;
  expertise?: string;
  qualification?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
