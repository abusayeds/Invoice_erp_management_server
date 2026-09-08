import { Types } from "mongoose";

export const salespersonStatus = ["Active", "Inactive"] as const;

export interface TSalesperson {
  _id?: string;
  user_id?: Types.ObjectId;
  name: string;
  email?: string;
  status?: (typeof salespersonStatus)[number];
  isDeleted?: boolean;
}
