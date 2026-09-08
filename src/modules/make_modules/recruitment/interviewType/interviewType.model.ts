import { Schema, model } from "mongoose";
import { TInterviewType } from "./interviewType.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const interviewTypeSchema = new Schema<TInterviewType>(
  {
    ...recruitmentBaseFields,
    name: { type: String, required: true, trim: true },
    description: { type: String },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const InterviewTypeModel = model<TInterviewType>(
  "RecruitmentInterviewType",
  interviewTypeSchema
);
