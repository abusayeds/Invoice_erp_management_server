import { Schema, model } from "mongoose";
import { TBudgetMonitoring } from "../budget.types";

const schema = new Schema<TBudgetMonitoring>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    budget_id: { type: Schema.Types.ObjectId, ref: "BudgetPlan", required: true },
    monitoring_date: { type: Date, required: true },
    total_allocated: { type: Number, default: 0 },
    total_spent: { type: Number, default: 0 },
    total_remaining: { type: Number, default: 0 },
    variance_amount: { type: Number, default: 0 },
    variance_percentage: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BudgetMonitoringModel = model<TBudgetMonitoring>("BudgetMonitoring", schema);
