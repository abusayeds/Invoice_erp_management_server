import { Schema, model } from "mongoose";
import { TInterviewFeedback, feedbackRecommendations } from "./interviewFeedback.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const interviewFeedbackSchema = new Schema<TInterviewFeedback>(
  {
    ...recruitmentBaseFields,
    technical_rating: { type: Number },
    communication_rating: { type: Number },
    cultural_fit_rating: { type: Number },
    overall_rating: { type: Number },
    strengths: { type: String },
    weaknesses: { type: String },
    comments: { type: String },
    recommendation: { type: String, enum: feedbackRecommendations, default: "Maybe" },
    interview_id: { type: Schema.Types.ObjectId, ref: "RecruitmentInterview", index: true },
    interviewer_ids: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const InterviewFeedbackModel = model<TInterviewFeedback>(
  "RecruitmentInterviewFeedback",
  interviewFeedbackSchema
);
