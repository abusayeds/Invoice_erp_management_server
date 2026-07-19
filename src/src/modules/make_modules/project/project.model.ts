import { Schema, model, Types } from "mongoose";
import {
  milestoneStatus,
  projectStatus,
  TBugComment,
  TBugStage,
  TProject,
  TProjectActivityLog,
  TProjectBug,
  TProjectFile,
  TProjectMilestone,
  TProjectTask,
  TTaskComment,
  TTaskStage,
  TTaskSubtask,
  taskPriority,
} from "./project.interface";

const projectSchema = new Schema<TProject>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    budget: { type: Number, default: 0 },
    start_date: { type: Date },
    end_date: { type: Date },
    status: { type: String, enum: projectStatus, default: "Ongoing" },
    creator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teamMemberIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    clientIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const milestoneSchema = new Schema<TProjectMilestone>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    cost: { type: Number, default: 0 },
    start_date: { type: Date },
    end_date: { type: Date },
    summary: { type: String },
    status: { type: String, enum: milestoneStatus, default: "Incomplete" },
    progress: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const taskStageSchema = new Schema<TTaskStage>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    color: { type: String, default: "#051c4b" },
    complete: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    creator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const bugStageSchema = new Schema<TBugStage>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    color: { type: String, default: "#051c4b" },
    complete: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    creator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const projectTaskSchema = new Schema<TProjectTask>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    milestone_id: { type: Schema.Types.ObjectId, ref: "ProjectMilestone" },
    title: { type: String, required: true },
    priority: { type: String, enum: taskPriority, default: "Medium" },
    assigned_to: [{ type: Schema.Types.ObjectId, ref: "User" }],
    duration: { type: String },
    description: { type: String },
    stage_id: { type: Schema.Types.ObjectId, ref: "TaskStage" },
    creator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const projectBugSchema = new Schema<TProjectBug>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    priority: { type: String, enum: taskPriority, default: "Medium" },
    assigned_to: [{ type: Schema.Types.ObjectId, ref: "User" }],
    description: { type: String },
    stage_id: { type: Schema.Types.ObjectId, ref: "BugStage" },
    creator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const activityLogSchema = new Schema<TProjectActivityLog>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    log_type: { type: String, required: true },
    remark: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const projectFileSchema = new Schema<TProjectFile>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    file_name: { type: String, required: true },
    file_path: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const taskCommentSchema = new Schema<TTaskComment>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    task_id: { type: Schema.Types.ObjectId, ref: "ProjectTask", required: true },
    comment: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const taskSubtaskSchema = new Schema<TTaskSubtask>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    task_id: { type: Schema.Types.ObjectId, ref: "ProjectTask", required: true },
    name: { type: String, required: true },
    is_completed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const bugCommentSchema = new Schema<TBugComment>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bug_id: { type: Schema.Types.ObjectId, ref: "ProjectBug", required: true },
    comment: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProjectModel = model<TProject>("Project", projectSchema);
export const ProjectMilestoneModel = model<TProjectMilestone>("ProjectMilestone", milestoneSchema);
export const TaskStageModel = model<TTaskStage>("TaskStage", taskStageSchema);
export const BugStageModel = model<TBugStage>("BugStage", bugStageSchema);
export const ProjectTaskModel = model<TProjectTask>("ProjectTask", projectTaskSchema);
export const ProjectBugModel = model<TProjectBug>("ProjectBug", projectBugSchema);
export const ProjectActivityLogModel = model<TProjectActivityLog>(
  "ProjectActivityLog",
  activityLogSchema
);
export const ProjectFileModel = model<TProjectFile>("ProjectFile", projectFileSchema);
export const TaskCommentModel = model<TTaskComment>("TaskComment", taskCommentSchema);
export const TaskSubtaskModel = model<TTaskSubtask>("TaskSubtask", taskSubtaskSchema);
export const BugCommentModel = model<TBugComment>("BugComment", bugCommentSchema);

export const toObjectIds = (ids: string[] | Types.ObjectId[] | undefined): Types.ObjectId[] => {
  if (!ids?.length) return [];
  return ids.map((id) => (id instanceof Types.ObjectId ? id : new Types.ObjectId(String(id))));
};
