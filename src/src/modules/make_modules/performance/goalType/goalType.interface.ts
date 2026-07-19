import { Types } from "mongoose";
import { TPerformanceStatus } from "../indicatorCategory/indicatorCategory.interface";

export type TPerformanceGoalType = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  description?: string;
  status: TPerformanceStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
