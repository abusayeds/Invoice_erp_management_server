import { Schema, model } from "mongoose";
import { TJobType } from "./jobType.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const jobTypeSchema = new Schema<TJobType>(
  {
    ...recruitmentBaseFields,
    name: { type: String, required: true, trim: true },
    description: { type: String },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JobTypeModel = model<TJobType>("RecruitmentJobType", jobTypeSchema);
