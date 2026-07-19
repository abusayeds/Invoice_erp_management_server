import { Types } from "mongoose";

export const transferStatuses = ["pending", "completed", "failed"] as const;

export type TBankTransfer = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  transfer_number: string;
  transfer_date: Date;
  from_account_id: Types.ObjectId;
  to_account_id: Types.ObjectId;
  transfer_amount: number;
  transfer_charges?: number;
  reference_number?: string;
  description: string;
  status: (typeof transferStatuses)[number];
  isDeleted?: boolean;
};
