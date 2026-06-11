import { Schema, model } from "mongoose";
import { TCandidateOnboarding, candidateOnboardingStatus } from "./candidateOnboarding.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const candidateOnboardingSchema = new Schema<TCandidateOnboarding>(
  {
    ...recruitmentBaseFields,
    start_date: { type: Date, required: true },
    status: { type: String, enum: candidateOnboardingStatus, default: "Pending" },
    candidate_id: { type: Schema.Types.ObjectId, ref: "RecruitmentCandidate", required: true, index: true },
    checklist_id: { type: Schema.Types.ObjectId, ref: "RecruitmentOnboardingChecklist", required: true, index: true },
    buddy_employee_id: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const CandidateOnboardingModel = model<TCandidateOnboarding>(
  "RecruitmentCandidateOnboarding",
  candidateOnboardingSchema
);
