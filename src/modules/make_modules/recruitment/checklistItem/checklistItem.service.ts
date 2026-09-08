import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { assertCompanyRef, refName, resolveCompanyId } from "../recruitment.utils";
import { OnboardingChecklistModel } from "../onboardingChecklist/onboardingChecklist.model";
import { ChecklistItemModel } from "./checklistItem.model";
import { TChecklistItem } from "./checklistItem.interface";

const P = permission.recruitment.checklist_items;

const prepare = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  await assertCompanyRef(OnboardingChecklistModel, body.checklist_id, companyId, "Onboarding checklist");
  return body;
};

export const checklistItemService = createRecruitmentCrudService<TChecklistItem>({
  model: ChecklistItemModel,
  label: "Checklist item",
  perms: { manageAny: P.manage_any_checklist_items, manageOwn: P.manage_own_checklist_items },
  searchFields: ["task_name", "description", "category"],
  populate: [{ path: "checklist_id", select: "name" }],
  beforeCreate: prepare,
  beforeUpdate: prepare,
  formatItem: (d) => ({
    _id: d._id,
    task_name: d.task_name,
    description: d.description ?? null,
    category: d.category ?? null,
    assigned_to_role: d.assigned_to_role ?? null,
    due_day: d.due_day ?? null,
    is_required: d.is_required,
    status: d.status,
    checklist_id: refName(d.checklist_id),
    createdAt: d.createdAt,
  }),
});
