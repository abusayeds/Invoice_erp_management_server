import { Schema, model } from "mongoose";
import { trackingStatuses, TGoalTracking } from "../goal.types";

const schema = new Schema<TGoalTracking>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    goal_id: { type: Schema.Types.ObjectId, ref: "FinancialGoal", required: true },
    tracking_date: { type: Date, required: true },
    previous_amount: { type: Number, default: 0 },
    contribution_amount: { type: Number, default: 0 },
    current_amount: { type: Number, default: 0 },
    progress_percentage: { type: Number, default: 0 },
    days_remaining: { type: Number, default: 0 },
    projected_completion_date: { type: Date },
    on_track_status: { type: String, enum: trackingStatuses, default: "on_track" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GoalTrackingModel = model<TGoalTracking>("GoalTracking", schema);
