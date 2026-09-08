import { Schema, model } from "mongoose";
import { TChecklistItem } from "./checklistItem.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const checklistItemSchema = new Schema<TChecklistItem>(
  {
    ...recruitmentBaseFields,
    task_name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String },
    assigned_to_role: { type: String },
    due_day: { type: Number },
    is_required: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    checklist_id: {
      type: Schema.Types.ObjectId,
      ref: "RecruitmentOnboardingChecklist",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const ChecklistItemModel = model<TChecklistItem>(
  "RecruitmentChecklistItem",
  checklistItemSchema
);
