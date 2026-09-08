import { Schema, model } from "mongoose";
import { budgetPeriodStatuses, TBudgetPeriod } from "../budget.types";

const schema = new Schema<TBudgetPeriod>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    period_name: { type: String, required: true, trim: true },
    financial_year: { type: String, required: true, trim: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, enum: budgetPeriodStatuses, default: "draft" },
    approved_by: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BudgetPeriodModel = model<TBudgetPeriod>("BudgetPeriod", schema);
