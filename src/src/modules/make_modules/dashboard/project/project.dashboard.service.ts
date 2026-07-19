/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { AuthRequest } from "../../../../middlewares/auth";
import { UserModel } from "../../../basic_modules/user/user.model";
import {
  ProjectModel,
  ProjectTaskModel,
  ProjectBugModel,
  TaskStageModel,
  BugStageModel,
} from "../../project/project.model";
import {
  actorRole,
  companyObjectId,
  companyScope,
  countCompanyUsers,
  lastSixMonths,
  resolveActorUserId,
  resolveCompanyId,
  ROLE,
} from "../dashboard.utils";

const fmtDate = (d?: Date) =>
  d ? new Date(d).toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "";

/** Stage ids (per company) that mark a task/bug as complete. */
const completeStageIds = async (model: typeof TaskStageModel | typeof BugStageModel, companyId: string) => {
  const stages = await model.find({ ...companyScope(companyId), complete: true }).select("_id").lean();
  return stages.map((s) => s._id as Types.ObjectId);
};

/** Map assignee ObjectId[] -> joined display names. */
const assigneeNames = (ids: any, users: Map<string, string>) => {
  const list = (Array.isArray(ids) ? ids : [])
    .map((id: any) => users.get(String(id)))
    .filter((v): v is string => Boolean(v));
  return list.length ? list.join(", ") : "Unassigned";
};

/* ----------------------------- COMPANY ----------------------------- */
const companyDashboard = async (companyId: string) => {
  const scope = companyScope(companyId);
  const completeTaskStages = await completeStageIds(TaskStageModel, companyId);
  const completeBugStages = await completeStageIds(BugStageModel, companyId);

  const [totalProjects, totalTasks, totalBugs, totalUsers, totalClients, completedTasks] =
    await Promise.all([
      ProjectModel.countDocuments(scope),
      ProjectTaskModel.countDocuments(scope),
      ProjectBugModel.countDocuments(scope),
      countCompanyUsers(companyId, ROLE.staff),
      countCompanyUsers(companyId, ROLE.customer),
      ProjectTaskModel.countDocuments({ ...scope, stage_id: { $in: completeTaskStages } }),
    ]);

  // Recent tasks (latest 8) with project + stage + assignee names.
  const recentRaw = await ProjectTaskModel.find(scope)
    .sort({ createdAt: -1 })
    .limit(8)
    .populate("project_id", "name")
    .populate("stage_id", "name color complete")
    .lean();

  const assigneeIdSet = new Set<string>();
  recentRaw.forEach((t: any) => (t.assigned_to || []).forEach((id: any) => assigneeIdSet.add(String(id))));
  const assigneeUsers = await UserModel.find({ _id: { $in: [...assigneeIdSet] } })
    .select("name")
    .lean();
  const userNameMap = new Map<string, string>(assigneeUsers.map((u: any) => [String(u._id), u.name || ""]));

  const recentTasks = recentRaw.map((task: any) => ({
    id: task._id,
    title: task.title,
    priority: task.priority || "Medium",
    project: task.project_id?.name || "No Project",
    stage: task.stage_id?.name || "No Stage",
    stage_color: task.stage_id?.color || null,
    assignee: assigneeNames(task.assigned_to, userNameMap),
    created_at: fmtDate(task.createdAt),
    is_completed: task.stage_id ? !!task.stage_id.complete : false,
  }));

  const [ongoing, finished, onhold] = await Promise.all([
    ProjectModel.countDocuments({ ...scope, status: "Ongoing" }),
    ProjectModel.countDocuments({ ...scope, status: "Finished" }),
    ProjectModel.countDocuments({ ...scope, status: "Onhold" }),
  ]);
  const projectStatus = [
    { name: "Ongoing", value: ongoing, color: "#3b82f6" },
    { name: "Finished", value: finished, color: "#10b77f" },
    { name: "On Hold", value: onhold, color: "#f59e0b" },
  ];

  const [high, medium, low] = await Promise.all([
    ProjectTaskModel.countDocuments({ ...scope, priority: "High" }),
    ProjectTaskModel.countDocuments({ ...scope, priority: "Medium" }),
    ProjectTaskModel.countDocuments({ ...scope, priority: "Low" }),
  ]);
  const taskPriority = [
    { name: "High", value: high, color: "#ef4444" },
    { name: "Medium", value: medium, color: "#f59e0b" },
    { name: "Low", value: low, color: "#10b77f" },
  ];

  // Team performance (staff users with at least one assigned task; top 6).
  const staff = await UserModel.find({
    companyId: companyObjectId(companyId),
    role: ROLE.staff,
    isDeleted: false,
  })
    .select("name")
    .lean();

  const teamPerformanceRaw = await Promise.all(
    staff.map(async (u: any) => {
      const assignedFilter = { ...scope, assigned_to: u._id };
      const [tTotal, tDone] = await Promise.all([
        ProjectTaskModel.countDocuments(assignedFilter),
        ProjectTaskModel.countDocuments({ ...assignedFilter, stage_id: { $in: completeTaskStages } }),
      ]);
      return {
        name: u.name || "Unknown",
        total_tasks: tTotal,
        completed_tasks: tDone,
        completion_rate: tTotal > 0 ? Math.round((tDone / tTotal) * 100) : 0,
      };
    })
  );
  const teamPerformance = teamPerformanceRaw.filter((u) => u.total_tasks > 0).slice(0, 6);

  // Monthly progress (last 6 months): created vs completed.
  const monthlyProgress = await Promise.all(
    lastSixMonths().map(async ({ label, range }) => {
      const [created, completed] = await Promise.all([
        ProjectTaskModel.countDocuments({ ...scope, createdAt: range }),
        ProjectTaskModel.countDocuments({
          ...scope,
          updatedAt: range,
          stage_id: { $in: completeTaskStages },
        }),
      ]);
      return { month: label, created, completed };
    })
  );

  const overdueProjects = await ProjectModel.countDocuments({
    ...scope,
    end_date: { $lt: new Date() },
    status: { $ne: "Finished" },
  });

  const resolvedBugs = await ProjectBugModel.countDocuments({
    ...scope,
    stage_id: { $in: completeBugStages },
  });
  const bugStats = { open: totalBugs - resolvedBugs, resolved: resolvedBugs };

  return {
    stats: {
      total_projects: totalProjects,
      total_tasks: totalTasks,
      total_bugs: totalBugs,
      total_users: totalUsers,
      total_clients: totalClients,
      completed_tasks: completedTasks,
      completion_rate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      overdue_projects: overdueProjects,
    },
    recentTasks,
    projectStatus,
    taskPriority,
    teamPerformance,
    monthlyProgress,
    bugStats,
  };
};

/* ------------------------------ CLIENT ----------------------------- */
const clientDashboard = async (companyId: string, userId: string) => {
  const scope = companyScope(companyId);
  const completeTaskStages = await completeStageIds(TaskStageModel, companyId);
  const uid = companyObjectId(userId);

  const clientProjects = await ProjectModel.find({ ...scope, clientIds: uid }).lean();
  const projectIds = clientProjects.map((p: any) => p._id);

  const clientTasks = await ProjectTaskModel.find({ ...scope, project_id: { $in: projectIds } })
    .sort({ createdAt: -1 })
    .populate("project_id", "name")
    .populate("stage_id", "name color complete")
    .lean();

  const isDone = (t: any) => t.stage_id && t.stage_id.complete;
  const completedTasks = clientTasks.filter(isDone).length;

  const recentTasks = clientTasks.slice(0, 6).map((task: any) => ({
    id: task._id,
    title: task.title,
    priority: task.priority || "Medium",
    project: task.project_id?.name || "No Project",
    stage: task.stage_id?.name || "No Stage",
    stage_color: task.stage_id?.color || null,
    created_at: fmtDate(task.createdAt),
    is_completed: !!isDone(task),
  }));

  const projectProgress = await Promise.all(
    clientProjects.map(async (project: any) => {
      const [tTotal, tDone] = await Promise.all([
        ProjectTaskModel.countDocuments({ ...scope, project_id: project._id }),
        ProjectTaskModel.countDocuments({
          ...scope,
          project_id: project._id,
          stage_id: { $in: completeTaskStages },
        }),
      ]);
      return {
        name: project.name,
        progress: tTotal > 0 ? Math.round((tDone / tTotal) * 100) : 0,
        total_tasks: tTotal,
        completed_tasks: tDone,
        status: project.status,
      };
    })
  );

  return {
    stats: {
      total_projects: clientProjects.length,
      total_tasks: clientTasks.length,
      completed_tasks: completedTasks,
      completion_rate: clientTasks.length > 0 ? Math.round((completedTasks / clientTasks.length) * 100) : 0,
      pending_tasks: clientTasks.length - completedTasks,
    },
    recentTasks,
    projectProgress,
    clientProjects: clientProjects.map((p: any) => ({
      id: p._id,
      name: p.name,
      status: p.status,
      start_date: p.start_date,
      end_date: p.end_date,
    })),
  };
};

/* ------------------------------ STAFF ------------------------------ */
const staffDashboard = async (companyId: string, userId: string) => {
  const scope = companyScope(companyId);
  const completeTaskStages = await completeStageIds(TaskStageModel, companyId);
  const completeSet = new Set(completeTaskStages.map((id) => String(id)));
  const uid = companyObjectId(userId);

  const personalTasks = await ProjectTaskModel.find({ ...scope, assigned_to: uid })
    .populate("project_id", "name")
    .populate("stage_id", "name color complete")
    .lean();

  const isDone = (t: any) => t.stage_id && t.stage_id.complete;
  const completedTasks = personalTasks.filter(isDone).length;
  const pendingTasks = personalTasks.length - completedTasks;

  const taskPriority = ["High", "Medium", "Low"].map((p, i) => ({
    name: p,
    value: personalTasks.filter((t: any) => (t.priority || "Medium") === p).length,
    color: ["#ef4444", "#f59e0b", "#10b77f"][i],
  }));

  // Projects the staff is involved in.
  const projectIds = [...new Set(personalTasks.map((t: any) => String(t.project_id?._id || t.project_id)))];
  const staffProjects = await Promise.all(
    projectIds.map(async (pid) => {
      const project = await ProjectModel.findOne({ ...scope, _id: pid }).lean();
      if (!project) return null;
      const tasks = personalTasks.filter((t: any) => String(t.project_id?._id || t.project_id) === pid);
      const done = tasks.filter((t: any) => completeSet.has(String(t.stage_id?._id || t.stage_id))).length;
      return {
        name: (project as any).name,
        total_tasks: tasks.length,
        completed_tasks: done,
        progress: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0,
        status: (project as any).status,
      };
    })
  );

  const latestTasks = personalTasks.slice(0, 6).map((task: any) => ({
    id: task._id,
    title: task.title,
    priority: task.priority || "Medium",
    project: task.project_id?.name || "No Project",
    stage: task.stage_id?.name || "No Stage",
    stage_color: task.stage_id?.color || null,
    is_completed: !!isDone(task),
  }));

  return {
    stats: {
      total_tasks: personalTasks.length,
      completed_tasks: completedTasks,
      pending_tasks: pendingTasks > 0 ? pendingTasks : 0,
      completion_rate: personalTasks.length > 0 ? Math.round((completedTasks / personalTasks.length) * 100) : 0,
    },
    latestTasks,
    taskPriority,
    staffProjects: staffProjects.filter(Boolean),
  };
};

const getDashboard = async (req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  const userId = resolveActorUserId(req);
  const type = actorRole(req);

  if (type === ROLE.company || type === ROLE.superadmin) return companyDashboard(companyId);
  if (type === ROLE.customer) return clientDashboard(companyId, userId);
  return staffDashboard(companyId, userId);
};

export const projectDashboardService = { getDashboard };
