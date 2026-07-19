import { Types } from "mongoose";

const toId = (value: unknown): string | null => {
  if (value == null) return null;
  if (value instanceof Types.ObjectId) return value.toString();
  if (typeof value === "object" && "_id" in (value as object)) {
    return String((value as { _id: Types.ObjectId })._id);
  }
  return String(value);
};

type PopulatedCategory = {
  _id?: Types.ObjectId;
  category_name?: string;
  category_code?: string;
  description?: string;
};

type PopulatedAccount = {
  _id?: Types.ObjectId;
  account_code?: string;
  account_name?: string;
  normal_balance?: string;
};

type PopulatedGoal = {
  _id?: Types.ObjectId;
  goal_name?: string;
  goal_description?: string;
  goal_type?: string;
  target_amount?: number;
  current_amount?: number;
  start_date?: Date;
  target_date?: Date;
  priority?: string;
  status?: string;
  category_id?: PopulatedCategory | Types.ObjectId;
  account_id?: PopulatedAccount | Types.ObjectId;
};

export const formatPopulatedGoal = (goal: PopulatedGoal | null | undefined) => {
  if (!goal || !goal.goal_name) return null;

  const category =
    goal.category_id && typeof goal.category_id === "object" && "category_name" in goal.category_id
      ? goal.category_id
      : null;
  const account =
    goal.account_id && typeof goal.account_id === "object" && "account_name" in goal.account_id
      ? goal.account_id
      : null;

  const targetAmount = goal.target_amount ?? 0;
  const currentAmount = goal.current_amount ?? 0;

  return {
    _id: toId(goal._id),
    goal_name: goal.goal_name,
    goal_description: goal.goal_description ?? null,
    goal_type: goal.goal_type,
    target_amount: targetAmount,
    current_amount: currentAmount,
    remaining_amount: Math.max(0, targetAmount - currentAmount),
    start_date: goal.start_date,
    target_date: goal.target_date,
    priority: goal.priority,
    status: goal.status,
    category: category
      ? {
          _id: toId(category._id),
          category_name: category.category_name,
          category_code: category.category_code,
          description: category.description ?? null,
        }
      : goal.category_id
        ? { _id: toId(goal.category_id) }
        : null,
    account: account
      ? {
          _id: toId(account._id),
          account_code: account.account_code,
          account_name: account.account_name,
          normal_balance: account.normal_balance,
        }
      : goal.account_id
        ? { _id: toId(goal.account_id) }
        : null,
  };
};

type TrackingLean = {
  _id: Types.ObjectId;
  goal_id: PopulatedGoal | Types.ObjectId;
  tracking_date: Date;
  previous_amount: number;
  contribution_amount: number;
  current_amount: number;
  progress_percentage: number;
  days_remaining: number;
  projected_completion_date?: Date | null;
  on_track_status: string;
  creator_id?: { _id: Types.ObjectId; name?: string; email?: string } | Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export const formatTrackingDetail = (tracking: TrackingLean) => {
  const goalRaw =
    tracking.goal_id && typeof tracking.goal_id === "object" && "goal_name" in tracking.goal_id
      ? (tracking.goal_id as PopulatedGoal)
      : null;
  const goal = formatPopulatedGoal(goalRaw);
  const targetAmount = goal?.target_amount ?? 0;
  const currentAmount = tracking.current_amount ?? 0;
  const progressPct = tracking.progress_percentage ?? 0;
  const daysRemaining = tracking.days_remaining ?? 0;
  const remainingAmount = Math.max(0, targetAmount - currentAmount);
  const isOverdue = daysRemaining < 0;

  const creator =
    tracking.creator_id && typeof tracking.creator_id === "object" && "name" in tracking.creator_id
      ? {
          _id: toId(tracking.creator_id._id),
          name: tracking.creator_id.name,
          email: tracking.creator_id.email,
        }
      : tracking.creator_id
        ? { _id: toId(tracking.creator_id) }
        : null;

  return {
    _id: toId(tracking._id),
    goal_id: goal?._id ?? toId(tracking.goal_id),
    tracking_date: tracking.tracking_date,
    previous_amount: tracking.previous_amount,
    contribution_amount: tracking.contribution_amount,
    current_amount: currentAmount,
    progress_percentage: progressPct,
    days_remaining: daysRemaining,
    projected_completion_date: tracking.projected_completion_date ?? null,
    on_track_status: tracking.on_track_status,
    remaining_amount: remainingAmount,
    is_overdue: isOverdue,
    overdue_days: isOverdue ? Math.abs(daysRemaining) : 0,
    progress: {
      target_amount: targetAmount,
      current_amount: currentAmount,
      progress: progressPct,
    },
    financial_details: {
      previous_amount: tracking.previous_amount,
      contribution_amount: tracking.contribution_amount,
      current_amount: currentAmount,
      remaining_amount: remainingAmount,
    },
    timeline_details: {
      tracking_date: tracking.tracking_date,
      days_remaining: daysRemaining,
      projected_completion_date: tracking.projected_completion_date ?? null,
      on_track_status: tracking.on_track_status,
      is_overdue: isOverdue,
      overdue_days: isOverdue ? Math.abs(daysRemaining) : 0,
    },
    goal,
    creator,
    createdAt: tracking.createdAt,
    updatedAt: tracking.updatedAt,
  };
};
