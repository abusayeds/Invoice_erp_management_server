import { Types } from "mongoose";
import { TPerformanceStatus } from "../indicatorCategory/indicatorCategory.interface";

export type TReviewCycleFrequency = "monthly" | "quarterly" | "semi-annual" | "annual";

export type TPerformanceReviewCycle = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  frequency: TReviewCycleFrequency;
  description?: string;
  status: TPerformanceStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
