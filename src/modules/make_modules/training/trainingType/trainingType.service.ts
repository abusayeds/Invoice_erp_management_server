import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createTrainingCrudService } from "../training.crud.service";
import {
  assertHrmBranch,
  assertHrmDepartment,
  refName,
  resolveCompanyId,
} from "../training.utils";
import { TrainingTypeModel } from "./trainingType.model";
import { TTrainingType } from "./trainingType.interface";

const P = permission.training.training;

/** Branch + department must belong to the same company (Laravel exists:branches / exists:departments). */
const prepare = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  await assertHrmBranch(body.branch_id, companyId);
  await assertHrmDepartment(body.department_id, companyId);
  return body;
};

export const trainingTypeService = createTrainingCrudService<TTrainingType>({
  model: TrainingTypeModel,
  label: "Training type",
  perms: {
    manageAny: P.manage_any_training_types,
    manageOwn: P.manage_own_training_types,
  },
  searchFields: ["name", "description"],
  populate: [
    { path: "branch_id", select: "branch_name" },
    { path: "department_id", select: "department_name" },
  ],
  beforeCreate: prepare,
  beforeUpdate: prepare,
  formatItem: (d) => ({
    _id: d._id,
    name: d.name,
    description: d.description ?? null,
    branch_id: refName(d.branch_id, "branch_name"),
    department_id: refName(d.department_id, "department_name"),
    createdAt: d.createdAt,
  }),
});
