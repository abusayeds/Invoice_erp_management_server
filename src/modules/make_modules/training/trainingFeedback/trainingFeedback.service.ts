import httpStatus from "http-status";
import { FilterQuery } from "mongoose";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import {
  companyObjectId,
  companyScope,
  creatorObjectId,
  refName,
  resolveCompanyId,
  resolveOwnership,
} from "../training.utils";
import { TrainingTaskModel } from "../trainingTask/trainingTask.model";
import { TrainingFeedbackModel } from "./trainingFeedback.model";
import { TTrainingFeedback } from "./trainingFeedback.interface";

const P = permission.training.training;

const populateRefs = [
  { path: "training_task_id", select: "title" },
  { path: "employee_user_id", select: "name" },
];

const format = (d: TTrainingFeedback) => ({
  _id: d._id,
  training_task_id: refName(d.training_task_id, "title"),
  employee_user_id: refName(d.employee_user_id),
  rating: d.rating,
  comments: d.comments ?? null,
  createdAt: d.createdAt,
});

/** manage-own -> feedback the user created OR about themselves (Laravel creator_id OR user_id). */
const ownershipFilter = (req: AuthRequest): FilterQuery<TTrainingFeedback> => {
  const companyId = resolveCompanyId(req);
  const ownership = resolveOwnership(
    req,
    P.manage_any_training_feedbacks,
    P.manage_own_training_feedbacks
  );
  const base = companyScope(companyId) as FilterQuery<TTrainingFeedback>;

  if (ownership.canManageAny) return base;
  if (!ownership.canManageOwn) return { ...base, _id: { $exists: false } };
  return {
    ...base,
    $or: [{ creator_id: ownership.actorId }, { employee_user_id: ownership.actorId }],
  };
};

const resolveTask = async (req: AuthRequest, taskId: string) => {
  const companyId = resolveCompanyId(req);
  const task = await TrainingTaskModel.findOne({ _id: taskId, ...companyScope(companyId) });
  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  return task;
};

const create = async (req: AuthRequest, taskId: string, body: Record<string, unknown>) => {
  const companyId = resolveCompanyId(req);
  const task = await resolveTask(req, taskId);

  // Feedback is recorded for the employee assigned to the task (Laravel $task->assigned_to).
  if (!task.assigned_to) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not assigned.");
  }

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rating must be an integer between 1 and 5");
  }

  const doc = await TrainingFeedbackModel.create({
    training_task_id: task._id,
    employee_user_id: task.assigned_to,
    rating,
    comments: body.comments,
    user_id: companyObjectId(companyId),
    creator_id: creatorObjectId(req),
    isDeleted: false,
  });
  const created = await doc.populate(populateRefs);
  return format(created as unknown as TTrainingFeedback);
};

const list = async (req: AuthRequest, taskId: string, query: Record<string, unknown>) => {
  await resolveTask(req, taskId);
  const base = {
    ...ownershipFilter(req),
    training_task_id: taskId,
  } as FilterQuery<TTrainingFeedback>;
  const qb = new queryBuilder(TrainingFeedbackModel.find(base).populate(populateRefs), query)
    .search(["comments"])
    .filter()
    .sort()
    .fields();
  const { totalData } = await qb.paginate(TrainingFeedbackModel.find(base));
  const rows = await qb.modelQuery.exec();
  const data = rows.map((d) => format(d as unknown as TTrainingFeedback));
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const pagination = qb.calculatePagination({ totalData, currentPage, limit });
  return { data, pagination };
};

export const trainingFeedbackService = { create, list };
