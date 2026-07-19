import { Types } from "mongoose";

export const goalTypes = ["savings", "debt_reduction", "expense_reduction"] as const;
export type GoalType = (typeof goalTypes)[number];

export const goalPriorities = ["low", "medium", "high", "critical"] as const;
export type GoalPriority = (typeof goalPriorities)[number];

export const goalStatuses = ["draft", "active", "completed", "paused", "cancelled"] as const;
export type GoalStatus = (typeof goalStatuses)[number];

export const milestoneStatuses = ["pending", "achieved", "overdue"] as const;
export type MilestoneStatus = (typeof milestoneStatuses)[number];

export const contributionTypes = ["manual", "automatic"] as const;
export type ContributionType = (typeof contributionTypes)[number];

export const contributionReferenceTypes = [
  "journal_entry",
  "bank_transaction",
  "manual",
] as const;
export type ContributionReferenceType = (typeof contributionReferenceTypes)[number];

export const trackingStatuses = ["ahead", "on_track", "behind", "critical"] as const;
export type TrackingStatus = (typeof trackingStatuses)[number];

export type TGoalCategory = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  category_name: string;
  category_code: string;
  description?: string;
  is_active: boolean;
  isDeleted: boolean;
};

export type TGoal = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  goal_name: string;
  goal_description?: string;
  category_id: Types.ObjectId;
  goal_type: GoalType;
  target_amount: number;
  current_amount: number;
  start_date: Date;
  target_date: Date;
  priority: GoalPriority;
  status: GoalStatus;
  account_id?: Types.ObjectId;
  isDeleted: boolean;
};

export type TGoalMilestone = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  goal_id: Types.ObjectId;
  milestone_name: string;
  milestone_description?: string;
  target_amount: number;
  target_date: Date;
  achieved_date?: Date;
  achieved_amount: number;
  status: MilestoneStatus;
  isDeleted: boolean;
};

export type TGoalContribution = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  goal_id: Types.ObjectId;
  contribution_date: Date;
  contribution_amount: number;
  contribution_type: ContributionType;
  reference_type?: ContributionReferenceType;
  reference_id?: Types.ObjectId;
  notes?: string;
  isDeleted: boolean;
};

export type TGoalTracking = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  goal_id: Types.ObjectId;
  tracking_date: Date;
  previous_amount: number;
  contribution_amount: number;
  current_amount: number;
  progress_percentage: number;
  days_remaining: number;
  projected_completion_date?: Date;
  on_track_status: TrackingStatus;
  isDeleted: boolean;
};
