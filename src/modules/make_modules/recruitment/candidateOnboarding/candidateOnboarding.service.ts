import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import {
  assertCompanyRef,
  assertEmployeeUser,
  formatDateOnly,
  parseDate,
  refName,
  resolveCompanyId,
} from "../recruitment.utils";
import { CandidateModel } from "../candidate/candidate.model";
import { OnboardingChecklistModel } from "../onboardingChecklist/onboardingChecklist.model";
import { CandidateOnboardingModel } from "./candidateOnboarding.model";
import { TCandidateOnboarding } from "./candidateOnboarding.interface";

const P = permission.recruitment.candidate_onboardings;

const prepare = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  await assertCompanyRef(CandidateModel, body.candidate_id, companyId, "Candidate");
  await assertCompanyRef(OnboardingChecklistModel, body.checklist_id, companyId, "Onboarding checklist");
  await assertEmployeeUser(body.buddy_employee_id, companyId, "Buddy employee");
  if (body.start_date !== undefined) body.start_date = parseDate(body.start_date, "start date");
  return body;
};

const populate = [
  { path: "candidate_id", select: "first_name last_name email" },
  { path: "checklist_id", select: "name" },
  { path: "buddy_employee_id", select: "name email" },
];

const format = (d: TCandidateOnboarding) => ({
  _id: d._id,
  start_date: formatDateOnly(d.start_date),
  status: d.status,
  candidate_id: refName(d.candidate_id, "first_name"),
  checklist_id: refName(d.checklist_id),
  buddy_employee_id: refName(d.buddy_employee_id),
  createdAt: d.createdAt,
});

export const candidateOnboardingService = createRecruitmentCrudService<TCandidateOnboarding>({
  model: CandidateOnboardingModel,
  label: "Candidate onboarding",
  perms: { manageAny: P.manage_any_candidate_onboardings, manageOwn: P.manage_own_candidate_onboardings },
  searchFields: ["status"],
  populate,
  beforeCreate: prepare,
  beforeUpdate: prepare,
  formatItem: format,
});
