import { Types } from "mongoose";

export type TTrainingFeedback = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  training_task_id: Types.ObjectId;
  employee_user_id?: Types.ObjectId;
  rating: number;
  comments?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
