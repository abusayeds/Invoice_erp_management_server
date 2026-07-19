import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { InterviewTypeModel } from "./interviewType.model";
import { TInterviewType } from "./interviewType.interface";

const P = permission.recruitment.interview_types;

export const interviewTypeService = createRecruitmentCrudService<TInterviewType>({
  model: InterviewTypeModel,
  label: "Interview type",
  perms: { manageAny: P.manage_any_interview_types, manageOwn: P.manage_own_interview_types },
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
