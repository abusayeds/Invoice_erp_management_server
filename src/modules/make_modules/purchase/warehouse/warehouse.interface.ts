import { Types } from "mongoose";

export type TWarehouse = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  name: string;
  address: string;
  city: string;
  zip_code: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
