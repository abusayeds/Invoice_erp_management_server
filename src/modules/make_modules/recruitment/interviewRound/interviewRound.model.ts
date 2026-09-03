import { Schema, model } from "mongoose";
import { TInterviewRound, interviewRoundStatuses } from "./interviewRound.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const interviewRoundSchema = new Schema<TInterviewRound>(
  {
    ...recruitmentBaseFields,
    name: { type: String, required: true, trim: true },
    sequence_number: { type: Number },
    description: { type: String },
    status: { type: String, enum: interviewRoundStatuses, default: "Active" },
    job_id: { type: Schema.Types.ObjectId, ref: "RecruitmentJobPosting" },
  },
  { timestamps: true }
);

export const InterviewRoundModel = model<TInterviewRound>(
  "RecruitmentInterviewRound",
  interviewRoundSchema
);
