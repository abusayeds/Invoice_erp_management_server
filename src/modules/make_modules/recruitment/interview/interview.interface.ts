import { Types } from "mongoose";

export type TInterview = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  scheduled_date: string;
  scheduled_time: string;
  duration?: number;
  location?: string;
  meeting_link?: string;
  interviewer_ids?: Types.ObjectId[];
  status: string;
  feedback_submitted: boolean;
  candidate_id?: Types.ObjectId;
  job_id?: Types.ObjectId;
  round_id?: Types.ObjectId;
  interview_type_id?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
