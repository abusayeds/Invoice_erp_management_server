import { Types } from "mongoose";

/** Hiring recommendation (readable enum — replaces the old 0 code). */
export const feedbackRecommendations = ["Hire", "Maybe", "No Hire"] as const;
export type TFeedbackRecommendation = (typeof feedbackRecommendations)[number];

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
