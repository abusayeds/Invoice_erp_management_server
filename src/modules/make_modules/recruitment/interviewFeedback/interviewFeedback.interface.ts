import { Types } from "mongoose";

export type TInterviewFeedback = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  technical_rating?: number;
  communication_rating?: number;
  cultural_fit_rating?: number;
  overall_rating?: number;
  strengths?: string;
  weaknesses?: string;
  comments?: string;
  recommendation: string;
  interview_id?: Types.ObjectId;
  interviewer_ids?: Types.ObjectId[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
