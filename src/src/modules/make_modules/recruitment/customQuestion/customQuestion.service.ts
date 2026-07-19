import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { CustomQuestionModel } from "./customQuestion.model";
import { TCustomQuestion } from "./customQuestion.interface";

const P = permission.recruitment.custom_questions;

export const customQuestionService = createRecruitmentCrudService<TCustomQuestion>({
  model: CustomQuestionModel,
  label: "Custom question",
  perms: { manageAny: P.manage_any_custom_questions, manageOwn: P.manage_own_custom_questions },
  searchFields: ["question"],
  formatItem: (d) => ({
    _id: d._id,
    question: d.question,
    type: d.type,
    options: d.options ?? [],
    is_required: d.is_required,
    is_active: d.is_active,
    sort_order: d.sort_order ?? null,
    createdAt: d.createdAt,
  }),
});
