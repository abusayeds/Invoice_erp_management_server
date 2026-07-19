import { Types } from "mongoose";

export type TJobLocation = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  remote_work: boolean;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  status: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
