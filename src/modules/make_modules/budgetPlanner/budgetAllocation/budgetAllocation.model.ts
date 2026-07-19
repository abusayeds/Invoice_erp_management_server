import { Schema, model } from "mongoose";
import { TBudgetAllocation } from "../budget.types";

const schema = new Schema<TBudgetAllocation>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    budget_id: { type: Schema.Types.ObjectId, ref: "BudgetPlan", required: true },
    account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount", required: true },
    allocated_amount: { type: Number, required: true, min: 0 },
    spent_amount: { type: Number, default: 0, min: 0 },
    remaining_amount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BudgetAllocationModel = model<TBudgetAllocation>("BudgetAllocation", schema);
