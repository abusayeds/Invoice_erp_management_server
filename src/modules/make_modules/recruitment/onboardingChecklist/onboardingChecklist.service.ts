import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { OnboardingChecklistModel } from "./onboardingChecklist.model";
import { TOnboardingChecklist } from "./onboardingChecklist.interface";

const P = permission.recruitment.onboarding_checklists;

export const onboardingChecklistService = createRecruitmentCrudService<TOnboardingChecklist>({
  model: OnboardingChecklistModel,
  label: "Onboarding checklist",
  perms: { manageAny: P.manage_any_onboarding_checklists, manageOwn: P.manage_own_onboarding_checklists },
  searchFields: ["name", "description"],
  nameField: "name",
  formatItem: (d) => ({
    _id: d._id,
    name: d.name,
    description: d.description ?? null,
    is_default: d.is_default,
    status: d.status,
    createdAt: d.createdAt,
  }),
});
