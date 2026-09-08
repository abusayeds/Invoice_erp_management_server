import { Types } from "mongoose";

/** Offer lifecycle + approval (readable enums — replace the old 0/pending codes). */
export const offerStatuses = ["Pending", "Sent", "Accepted", "Declined"] as const;
export const offerApprovalStatuses = ["Pending", "Approved", "Rejected"] as const;
export type TOfferStatus = (typeof offerStatuses)[number];
export type TOfferApprovalStatus = (typeof offerApprovalStatuses)[number];

export type TOffer = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  candidate_id: Types.ObjectId;
  job_id?: Types.ObjectId;
  offer_date: Date;
  position: string;
  department_id?: Types.ObjectId;
  salary: number;
  bonus?: number;
  equity?: string;
  benefits?: string;
  start_date: Date;
  expiration_date: Date;
  offer_letter_path?: string;
  status: string;
  response_date?: Date;
  decline_reason?: string;
  converted_to_employee: boolean;
  employee_id?: Types.ObjectId;
  approved_by?: Types.ObjectId;
  approval_status: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
