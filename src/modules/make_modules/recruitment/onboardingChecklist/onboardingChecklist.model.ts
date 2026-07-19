import { Schema, model } from "mongoose";
import { TOnboardingChecklist } from "./onboardingChecklist.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const onboardingChecklistSchema = new Schema<TOnboardingChecklist>(
  {
    ...recruitmentBaseFields,
    name: { type: String, required: true, trim: true },
    description: { type: String },
    is_default: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const OnboardingChecklistModel = model<TOnboardingChecklist>(
  "RecruitmentOnboardingChecklist",
  onboardingChecklistSchema
);
