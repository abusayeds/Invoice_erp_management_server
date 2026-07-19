import { Schema, model } from "mongoose";
import { goalPriorities, goalStatuses, goalTypes, TGoal } from "../goal.types";

const schema = new Schema<TGoal>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    goal_name: { type: String, required: true, trim: true },
    goal_description: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: "GoalCategory", required: true },
    goal_type: { type: String, enum: goalTypes, required: true },
    target_amount: { type: Number, required: true, min: 0 },
    current_amount: { type: Number, default: 0, min: 0 },
    start_date: { type: Date, required: true },
    target_date: { type: Date, required: true },
    priority: { type: String, enum: goalPriorities, default: "medium" },
    status: { type: String, enum: goalStatuses, default: "draft" },
    account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GoalModel = model<TGoal>("FinancialGoal", schema);
