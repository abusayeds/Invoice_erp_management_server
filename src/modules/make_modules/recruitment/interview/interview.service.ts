import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { assertCompanyRef, companyScope, refName, resolveCompanyId } from "../recruitment.utils";
import { CandidateModel } from "../candidate/candidate.model";
import { InterviewRoundModel } from "../interviewRound/interviewRound.model";
import { InterviewTypeModel } from "../interviewType/interviewType.model";
import { InterviewModel } from "./interview.model";
import { TInterview } from "./interview.interface";

const P = permission.recruitment.interviews;

const prepare = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  await assertCompanyRef(CandidateModel, body.candidate_id, companyId, "Candidate");
  await assertCompanyRef(InterviewRoundModel, body.round_id, companyId, "Interview round");
  await assertCompanyRef(InterviewTypeModel, body.interview_type_id, companyId, "Interview type");

  // job_id is derived from the candidate (Laravel sets it from candidate->job_id).
  if (body.candidate_id) {
    const candidate = await CandidateModel.findOne({ _id: body.candidate_id, ...companyScope(companyId) });
    if (candidate?.job_id) body.job_id = candidate.job_id;
  }
  if (body.interviewer_ids !== undefined) {
    body.interviewer_ids = Array.isArray(body.interviewer_ids)
      ? body.interviewer_ids
      : [body.interviewer_ids];
  }
  return body;
};

const populate = [
  { path: "candidate_id", select: "first_name last_name email" },
  { path: "job_id", select: "title" },
  { path: "round_id", select: "name" },
  { path: "interview_type_id", select: "name" },
  { path: "interviewer_ids", select: "name email" },
];

const format = (d: TInterview) => ({
  _id: d._id,
  scheduled_date: d.scheduled_date,
  scheduled_time: d.scheduled_time,
  duration: d.duration ?? null,
  location: d.location ?? null,
  meeting_link: d.meeting_link ?? null,
  interviewer_ids: d.interviewer_ids ?? [],
  status: d.status,
  feedback_submitted: d.feedback_submitted,
  candidate_id: refName(d.candidate_id, "first_name"),
  job_id: refName(d.job_id, "title"),
  round_id: refName(d.round_id),
  interview_type_id: refName(d.interview_type_id),
  createdAt: d.createdAt,
});

export const interviewService = createRecruitmentCrudService<TInterview>({
  model: InterviewModel,
  label: "Interview",
  perms: { manageAny: P.manage_any_interviews, manageOwn: P.manage_own_interviews },
  searchFields: ["location", "meeting_link"],
  populate,
  beforeCreate: prepare,
  beforeUpdate: prepare,
  formatItem: format,
});
