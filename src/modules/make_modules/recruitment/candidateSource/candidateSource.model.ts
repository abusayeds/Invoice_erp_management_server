import { Schema, model } from "mongoose";
import { TCandidateSource } from "./candidateSource.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const candidateSourceSchema = new Schema<TCandidateSource>(
  {
    ...recruitmentBaseFields,
    name: { type: String, required: true, trim: true },
    description: { type: String },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CandidateSourceModel = model<TCandidateSource>(
  "RecruitmentCandidateSource",
  candidateSourceSchema
);
