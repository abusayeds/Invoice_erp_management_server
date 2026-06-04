import { Types } from "mongoose";

export type TPerformanceStatus = "active" | "inactive";

export type TIndicatorCategory = {
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
