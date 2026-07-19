import { Schema, model } from "mongoose";
import { TCustomQuestion, customQuestionTypes } from "./customQuestion.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const customQuestionSchema = new Schema<TCustomQuestion>(
  {
    ...recruitmentBaseFields,
    question: { type: String, required: true, trim: true },
    type: { type: String, enum: customQuestionTypes, default: "text" },
    options: { type: [String], default: [] },
    is_required: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number },
  },
  { timestamps: true }
);

export const CustomQuestionModel = model<TCustomQuestion>(
  "RecruitmentCustomQuestion",
  customQuestionSchema
);
