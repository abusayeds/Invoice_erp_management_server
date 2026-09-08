import { Schema, model } from "mongoose";
import { milestoneStatuses, TGoalMilestone } from "../goal.types";

const schema = new Schema<TGoalMilestone>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    goal_id: { type: Schema.Types.ObjectId, ref: "FinancialGoal", required: true },
    milestone_name: { type: String, required: true, trim: true },
    milestone_description: { type: String },
    target_amount: { type: Number, required: true, min: 0 },
    target_date: { type: Date, required: true },
    achieved_date: { type: Date },
    achieved_amount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: milestoneStatuses, default: "pending" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GoalMilestoneModel = model<TGoalMilestone>("GoalMilestone", schema);
