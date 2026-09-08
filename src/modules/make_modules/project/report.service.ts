import { Types } from "mongoose";
import queryBuilder from "../../../builder/queryBuilder";
import { UserModel } from "../../basic_modules/user/user.model";
import {
  ProjectModel,
  ProjectTaskModel,
  ProjectBugModel,
  ProjectMilestoneModel,
  TaskStageModel,
  BugStageModel,
} from "./project.model";
import {
  assertProject,
  companyObjectId,
  formatDate,
  formatProjectResponse,
  toListQuery,
} from "./project.utils";

/** "done/total" string, or "0/0" when there are none (Laravel report counters). */
const ratio = (done: number, total: number) => (total > 0 ? `${done}/${total}` : "0/0");

/** Stage ids (per company) marked complete — used to count finished tasks/bugs. */
const completeStageIds = async (
  model: typeof TaskStageModel | typeof BugStageModel,
  userId: string
) => {
  const stages = await model.find({ user_id: userId, complete: true, isDeleted: false }).select("_id");
  return stages.map((s) => s._id as Types.ObjectId);
};

/* ------------------------------- LIST ------------------------------ */
const reportList = async (userId: string, query: Record<string, unknown>) => {
  const listQuery = toListQuery(query);

  const baseFilter: Record<string, unknown> = {
    user_id: companyObjectId(userId),
    isDeleted: false,
  };
  if (listQuery.status) baseFilter.status = listQuery.status;
  if (listQuery.date) {
    const d = new Date(String(listQuery.date));
    baseFilter.start_date = { $lte: d };
    baseFilter.end_date = { $gte: d };
  }

  const buildQuery = new queryBuilder(ProjectModel.find(baseFilter), listQuery)
    .search(["name"])
    .filter()
    .sort()
    .fields();

  const { totalData } = await buildQuery.paginate(ProjectModel.find(baseFilter));
  const projects = await buildQuery.modelQuery.exec();

  const currentPage = Number(listQuery.page) || 1;
  const limit = Number(listQuery.limit) || 10;
  const pagination = buildQuery.calculatePagination({ totalData, currentPage, limit });

  const completeTaskStages = await completeStageIds(TaskStageModel, userId);
  const completeBugStages = await completeStageIds(BugStageModel, userId);

  const allRecords = await Promise.all(
    projects.map(async (project) => {
      const [totalTasks, doneTasks, totalBugs, doneBugs, totalMilestones, doneMilestones] =
        await Promise.all([
          ProjectTaskModel.countDocuments({ project_id: project._id, isDeleted: false }),
          ProjectTaskModel.countDocuments({
            project_id: project._id,
            isDeleted: false,
            stage_id: { $in: completeTaskStages },
          }),
          ProjectBugModel.countDocuments({ project_id: project._id, isDeleted: false }),
          ProjectBugModel.countDocuments({
            project_id: project._id,
            isDeleted: false,
            stage_id: { $in: completeBugStages },
          }),
          ProjectMilestoneModel.countDocuments({ project_id: project._id, isDeleted: false }),
          ProjectMilestoneModel.countDocuments({
            project_id: project._id,
            isDeleted: false,
            status: "Complete",
          }),
        ]);

      return {
        _id: project._id,
        name: project.name,
        start_date: formatDate(project.start_date),
        end_date: formatDate(project.end_date),
        status: project.status,
        tasks_count: ratio(doneTasks, totalTasks),
        bugs_count: ratio(doneBugs, totalBugs),
        milestones_count: ratio(doneMilestones, totalMilestones),
      };
    })
  );

  return { allRecords: formatProjectResponse(allRecords), pagination };
};

/* ------------------------------ DETAIL ----------------------------- */
const reportDetails = async (userId: string, projectId: string) => {
  const project = await assertProject(projectId, userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tasks: any[] = await ProjectTaskModel.find({ project_id: project._id, isDeleted: false })
    .populate("stage_id", "name color complete")
    .lean();

  // Task status (group by stage) — pie chart.
  const stageMap = new Map<string, { name: string; value: number; color: string }>();
  for (const t of tasks) {
    const name = t.stage_id?.name || "No Stage";
    const entry = stageMap.get(name) || {
      name,
      value: 0,
      color: t.stage_id?.color || "#6b7280",
    };
    entry.value += 1;
    stageMap.set(name, entry);
  }
  const taskStatusData = [...stageMap.values()];

  // Task priority (group by priority) — bar chart.
  const priorityMap = new Map<string, { name: string; value: number }>();
  for (const t of tasks) {
    const name = t.priority || "No Priority";
    const entry = priorityMap.get(name) || { name, value: 0 };
    entry.value += 1;
    priorityMap.set(name, entry);
  }
  const taskPriorityData = [...priorityMap.values()];

  const completedTasks = tasks.filter((t) => t.stage_id?.complete).length;
  const projectStats = {
    total_tasks: tasks.length,
    completed_tasks: completedTasks,
    in_progress_tasks: tasks.filter((t) => t.stage_id && !t.stage_id.complete).length,
    team_members: project.teamMemberIds?.length || 0,
  };

  // Per team-member assigned vs done task counts.
  const members = await UserModel.find({ _id: { $in: project.teamMemberIds } }).select("name");
  const usersData = members.map((u) => {
    const assigned = tasks.filter((t) =>
      (t.assigned_to || []).some((id: Types.ObjectId) => String(id) === String(u._id))
    );
    const done = assigned.filter((t) => t.stage_id?.complete);
    return {
      _id: u._id,
      name: u.name,
      assigned_tasks: assigned.length,
      done_tasks: done.length,
    };
  });

  const milestones = await ProjectMilestoneModel.find({
    project_id: project._id,
    isDeleted: false,
  });
  const milestonesData = milestones.map((m) => ({
    _id: m._id,
    name: m.title,
    progress: m.progress ?? 0,
    cost: m.cost ?? 0,
    status: m.status,
    start_date: formatDate(m.start_date),
    end_date: formatDate(m.end_date),
  }));

  return formatProjectResponse({
    project: {
      _id: project._id,
      name: project.name,
      description: project.description,
      start_date: formatDate(project.start_date),
      end_date: formatDate(project.end_date),
      status: project.status,
      budget: project.budget,
    },
    taskStatusData,
    taskPriorityData,
    projectStats,
    usersData,
    milestonesData,
  });
};

export const reportService = { reportList, reportDetails };
