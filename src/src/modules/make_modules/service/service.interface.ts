import { Types } from "mongoose";

export type TCurrency = "USD" | "BDT" | "EUR" | "INR";

export interface TService {
  _id?: string;
  user_id :  Types.ObjectId
  serviceName: string;
  unitType: string;
  quantity: number;
  rate: number;
  taxes?: string[];
  currency: TCurrency | string;
  description?: string;
  serviceStock: boolean;
  sac: boolean;
  productStock: boolean;
  hsn: boolean;
  isArchive?: boolean;
  isDeleted?: boolean;
}
