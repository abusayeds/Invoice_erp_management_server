import { Types } from "mongoose";
import { TPerformanceStatus } from "../indicatorCategory/indicatorCategory.interface";

export type TPerformanceIndicator = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  category_id?: Types.ObjectId;
  name: string;
  description?: string;
  measurement_unit?: string;
  target_value?: string;
  status: TPerformanceStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
