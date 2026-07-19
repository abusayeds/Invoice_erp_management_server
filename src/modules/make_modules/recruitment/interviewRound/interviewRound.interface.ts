import { Types } from "mongoose";

/** Interview round availability (readable enum — replaces the old 0 code). */
export const interviewRoundStatuses = ["Active", "Inactive"] as const;
export type TInterviewRoundStatus = (typeof interviewRoundStatuses)[number];

export type TInterviewRound = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  sequence_number?: number;
  description?: string;
  status: string;
  job_id?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
