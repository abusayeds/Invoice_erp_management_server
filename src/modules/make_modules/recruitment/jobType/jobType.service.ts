import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { JobTypeModel } from "./jobType.model";
import { TJobType } from "./jobType.interface";

const P = permission.recruitment.job_types;

export const jobTypeService = createRecruitmentCrudService<TJobType>({
  model: JobTypeModel,
  label: "Job type",
  perms: { manageAny: P.manage_any_job_types, manageOwn: P.manage_own_job_types },
  searchFields: ["name", "description"],
  nameField: "name",
  formatItem: (d) => ({
    _id: d._id,
    name: d.name,
    description: d.description ?? null,
    is_active: d.is_active,
    createdAt: d.createdAt,
  }),
});
