import { Schema, model } from "mongoose";
import {
  contributionReferenceTypes,
  contributionTypes,
  TGoalContribution,
} from "../goal.types";

const schema = new Schema<TGoalContribution>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    goal_id: { type: Schema.Types.ObjectId, ref: "FinancialGoal", required: true },
    contribution_date: { type: Date, required: true },
    contribution_amount: { type: Number, required: true, min: 0 },
    contribution_type: { type: String, enum: contributionTypes, default: "manual" },
    reference_type: { type: String, enum: contributionReferenceTypes },
    reference_id: { type: Schema.Types.ObjectId },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GoalContributionModel = model<TGoalContribution>("GoalContribution", schema);
