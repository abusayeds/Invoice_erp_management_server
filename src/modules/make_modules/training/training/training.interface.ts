import { Types } from "mongoose";

export type TTrainingStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

export type TTraining = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  title: string;
  description?: string;
  training_type_id?: Types.ObjectId;
  trainer_id?: Types.ObjectId;
  branch_id?: Types.ObjectId;
  department_id?: Types.ObjectId;
  start_date: Date;
  end_date: Date;
  start_time: string;
  end_time: string;
  location?: string;
  max_participants?: number;
  cost?: number;
  status: TTrainingStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
