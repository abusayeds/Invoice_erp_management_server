import { Types } from "mongoose";

export const projectStatus = ["Ongoing", "Onhold", "Finished"] as const;
export type TProjectStatus = (typeof projectStatus)[number];

export const taskPriority = ["High", "Medium", "Low"] as const;
export type TTaskPriority = (typeof taskPriority)[number];

export const milestoneStatus = ["Incomplete", "Complete", "Ongoing"] as const;
export type TMilestoneStatus = (typeof milestoneStatus)[number];

export type TProject = {
  user_id: Types.ObjectId;
  name: string;
  description?: string;
  budget?: number;
  start_date?: Date;
  end_date?: Date;
  status: TProjectStatus;
  creator_id: Types.ObjectId;
  teamMemberIds: Types.ObjectId[];
  clientIds: Types.ObjectId[];
  isDeleted: boolean;
};

export type TProjectMilestone = {
  user_id: Types.ObjectId;
  project_id: Types.ObjectId;
  title: string;
  cost?: number;
  start_date?: Date;
  end_date?: Date;
  summary?: string;
  status?: TMilestoneStatus;
  progress?: number;
  isDeleted: boolean;
};

export type TProjectTask = {
  user_id: Types.ObjectId;
  project_id: Types.ObjectId;
  milestone_id?: Types.ObjectId;
  title: string;
  priority: TTaskPriority;
  assigned_to: Types.ObjectId[];
  duration?: string;
  description?: string;
  stage_id?: Types.ObjectId;
  creator_id: Types.ObjectId;
  isDeleted: boolean;
};

export type TProjectBug = {
  user_id: Types.ObjectId;
  project_id: Types.ObjectId;
  title: string;
  priority: TTaskPriority;
  assigned_to: Types.ObjectId[];
  description?: string;
  stage_id?: Types.ObjectId;
  creator_id: Types.ObjectId;
  isDeleted: boolean;
};

export type TTaskStage = {
  user_id: Types.ObjectId;
  name: string;
  color: string;
  complete: boolean;
  order: number;
  creator_id: Types.ObjectId;
  isDeleted: boolean;
};

export type TBugStage = {
  user_id: Types.ObjectId;
  name: string;
  color: string;
  complete: boolean;
  order: number;
  creator_id: Types.ObjectId;
  isDeleted: boolean;
};

export type TProjectActivityLog = {
  user_id: Types.ObjectId;
  project_id: Types.ObjectId;
  log_type: string;
  remark: Record<string, unknown> | string;
};

export type TProjectFile = {
  user_id: Types.ObjectId;
  project_id: Types.ObjectId;
  file_name: string;
  file_path: string;
  isDeleted: boolean;
};

export type TTaskComment = {
  user_id: Types.ObjectId;
  task_id: Types.ObjectId;
  comment: string;
  isDeleted: boolean;
};

export type TTaskSubtask = {
  user_id: Types.ObjectId;
  task_id: Types.ObjectId;
  name: string;
  is_completed: boolean;
  isDeleted: boolean;
};

export type TBugComment = {
  user_id: Types.ObjectId;
  bug_id: Types.ObjectId;
  comment: string;
  isDeleted: boolean;
};
