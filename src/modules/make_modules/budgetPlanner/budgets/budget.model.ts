import { Schema, model } from "mongoose";
import { budgetStatuses, budgetTypes, TBudget } from "../budget.types";

const schema = new Schema<TBudget>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    budget_name: { type: String, required: true, trim: true },
    period_id: { type: Schema.Types.ObjectId, ref: "BudgetPeriod", required: true },
    budget_type: { type: String, enum: budgetTypes, required: true },
    total_budget_amount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: budgetStatuses, default: "draft" },
    approved_by: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BudgetModel = model<TBudget>("BudgetPlan", schema);
