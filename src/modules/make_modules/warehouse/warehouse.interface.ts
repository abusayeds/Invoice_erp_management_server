import { Types } from "mongoose";

export type TWarehouse = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  name: string;
  address: string;
  city: string;
  zipcode: string;
  phone: string;
  status: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
