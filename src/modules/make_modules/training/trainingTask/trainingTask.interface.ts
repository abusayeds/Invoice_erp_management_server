import { Types } from "mongoose";

export type TTrainingTaskStatus = "pending" | "completed";

export type TTrainingTask = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  training_id: Types.ObjectId;
  title: string;
  description?: string;
  status: TTrainingTaskStatus;
  due_date?: Date;
  assigned_to?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
