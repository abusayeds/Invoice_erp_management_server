import { Types } from "mongoose";

export const budgetPeriodStatuses = ["draft", "approved", "active", "closed"] as const;
export type BudgetPeriodStatus = (typeof budgetPeriodStatuses)[number];

export const budgetStatuses = ["draft", "approved", "active", "closed"] as const;
export type BudgetStatus = (typeof budgetStatuses)[number];

export const budgetTypes = ["operational", "capital", "cash_flow"] as const;
export type BudgetType = (typeof budgetTypes)[number];

export type TBudgetPeriod = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  period_name: string;
  financial_year: string;
  start_date: Date;
  end_date: Date;
  status: BudgetPeriodStatus;
  approved_by?: Types.ObjectId;
  isDeleted: boolean;
};

export type TBudget = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  budget_name: string;
  period_id: Types.ObjectId;
  budget_type: BudgetType;
  total_budget_amount: number;
  status: BudgetStatus;
  approved_by?: Types.ObjectId;
  isDeleted: boolean;
};

export type TBudgetAllocation = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  budget_id: Types.ObjectId;
  account_id: Types.ObjectId;
  allocated_amount: number;
  spent_amount: number;
  remaining_amount: number;
  isDeleted: boolean;
};

export type TBudgetMonitoring = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  budget_id: Types.ObjectId;
  monitoring_date: Date;
  total_allocated: number;
  total_spent: number;
  total_remaining: number;
  variance_amount: number;
  variance_percentage: number;
  isDeleted: boolean;
};
