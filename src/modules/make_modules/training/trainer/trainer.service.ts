import httpStatus from "http-status";
import { FilterQuery } from "mongoose";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createTrainingCrudService } from "../training.crud.service";
import {
  assertHrmBranch,
  assertHrmDepartment,
  companyScope,
  refName,
  resolveCompanyId,
} from "../training.utils";
import { TrainerModel } from "./trainer.model";
import { TTrainer } from "./trainer.interface";

const P = permission.training.training;

/** Validate branch/department refs + enforce a unique email within the company (Laravel unique:trainers,email). */
const prepare = async (body: Record<string, unknown>, req: AuthRequest, id?: string) => {
  const companyId = resolveCompanyId(req);
  await assertHrmBranch(body.branch_id, companyId);
  await assertHrmDepartment(body.department_id, companyId);

  if (body.email !== undefined && body.email !== null && body.email !== "") {
    const email = String(body.email).trim().toLowerCase();
    const dupQuery: FilterQuery<TTrainer> = { ...companyScope(companyId), email };
    if (id) dupQuery._id = { $ne: id };
    const dup = await TrainerModel.findOne(dupQuery);
    if (dup) throw new AppError(httpStatus.CONFLICT, "Trainer with this email already exists");
    body.email = email;
  }
  return body;
};

export const trainerService = createTrainingCrudService<TTrainer>({
  model: TrainerModel,
  label: "Trainer",
  perms: {
    manageAny: P.manage_any_trainers,
    manageOwn: P.manage_own_trainers,
  },
  searchFields: ["name", "email", "contact", "experience"],
  populate: [
    { path: "branch_id", select: "branch_name" },
    { path: "department_id", select: "department_name" },
  ],
  beforeCreate: prepare,
  beforeUpdate: prepare,
  formatItem: (d) => ({
    _id: d._id,
    name: d.name,
    contact: d.contact,
    email: d.email,
    experience: d.experience,
    branch_id: refName(d.branch_id, "branch_name"),
    department_id: refName(d.department_id, "department_name"),
    expertise: d.expertise ?? null,
    qualification: d.qualification ?? null,
    createdAt: d.createdAt,
  }),
});
