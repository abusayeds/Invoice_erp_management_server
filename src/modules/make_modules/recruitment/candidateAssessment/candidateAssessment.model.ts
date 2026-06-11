import { Schema, model } from "mongoose";
import { TCandidateAssessment } from "./candidateAssessment.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const candidateAssessmentSchema = new Schema<TCandidateAssessment>(
  {
    ...recruitmentBaseFields,
    assessment_name: { type: String, required: true, trim: true },
    score: { type: Number },
    max_score: { type: Number },
    pass_fail_status: { type: String, default: "0" },
    comments: { type: String },
    assessment_date: { type: Date },
    candidate_id: { type: Schema.Types.ObjectId, ref: "RecruitmentCandidate", index: true },
    conducted_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const CandidateAssessmentModel = model<TCandidateAssessment>(
  "RecruitmentCandidateAssessment",
  candidateAssessmentSchema
);
