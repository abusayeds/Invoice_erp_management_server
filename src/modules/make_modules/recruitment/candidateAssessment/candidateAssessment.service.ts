import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import {
  assertEmployeeUser,
  formatDateOnly,
  parseDate,
  refName,
  resolveCompanyId,
} from "../recruitment.utils";
import { CandidateAssessmentModel } from "./candidateAssessment.model";
import { TCandidateAssessment } from "./candidateAssessment.interface";

const P = permission.recruitment.candidate_assessments;

const prepare = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  await assertEmployeeUser(body.conducted_by, companyId, "Conducted by");
  if (body.assessment_date !== undefined) {
    body.assessment_date = parseDate(body.assessment_date, "assessment date");
  }
  return body;
};

export const candidateAssessmentService = createRecruitmentCrudService<TCandidateAssessment>({
  model: CandidateAssessmentModel,
  label: "Candidate assessment",
  perms: { manageAny: P.manage_any_candidate_assessments, manageOwn: P.manage_own_candidate_assessments },
  searchFields: ["assessment_name", "comments"],
  populate: [{ path: "conducted_by", select: "name" }],
  beforeCreate: prepare,
  beforeUpdate: prepare,
  formatItem: (d) => ({
    _id: d._id,
    assessment_name: d.assessment_name,
    score: d.score ?? null,
    max_score: d.max_score ?? null,
    pass_fail_status: d.pass_fail_status,
    comments: d.comments ?? null,
    assessment_date: formatDateOnly(d.assessment_date),
    candidate_id: d.candidate_id ?? null,
    conducted_by: refName(d.conducted_by),
    createdAt: d.createdAt,
  }),
});
