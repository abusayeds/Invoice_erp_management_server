import httpStatus from "http-status";
import { FilterQuery } from "mongoose";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import {
  assertCompanyRef,
  companyScope,
  formatDateOnly,
  generateSequentialCode,
  parseDate,
  refName,
  resolveCompanyId,
} from "../recruitment.utils";
import { JobPostingModel } from "../jobPosting/jobPosting.model";
import { CandidateSourceModel } from "../candidateSource/candidateSource.model";
import { CandidateModel } from "./candidate.model";
import { TCandidate, candidateStatuses } from "./candidate.interface";

const P = permission.recruitment.candidates;

const prepare = async (body: Record<string, unknown>, req: AuthRequest, id?: string) => {
  const companyId = resolveCompanyId(req);
  await assertCompanyRef(JobPostingModel, body.job_id, companyId, "Job posting");
  await assertCompanyRef(CandidateSourceModel, body.source_id, companyId, "Candidate source");

  if (body.email !== undefined && body.email !== null && body.email !== "") {
    const email = String(body.email).trim().toLowerCase();
    const dup: FilterQuery<TCandidate> = { ...companyScope(companyId), email };
    if (id) dup._id = { $ne: id };
    if (await CandidateModel.findOne(dup)) {
      throw new AppError(httpStatus.CONFLICT, "Candidate with this email already exists");
    }
    body.email = email;
  }
  if (body.dob !== undefined && body.dob !== null && body.dob !== "") {
    body.dob = parseDate(body.dob, "date of birth");
  }
  if (body.application_date !== undefined) {
    body.application_date = parseDate(body.application_date, "application date");
  }
  return body;
};

const prepareCreate = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  const prepared = await prepare(body, req);
  prepared.tracking_id = await generateSequentialCode(CandidateModel, companyId, "TRK", "tracking_id");
  return prepared;
};

const prepareUpdate = async (body: Record<string, unknown>, req: AuthRequest, id: string) => {
  const prepared = await prepare(body, req, id);
  delete prepared.tracking_id;
  return prepared;
};

const populate = [
  { path: "job_id", select: "title posting_code" },
  { path: "source_id", select: "name" },
];

const format = (d: TCandidate) => ({
  _id: d._id,
  tracking_id: d.tracking_id ?? null,
  first_name: d.first_name,
  last_name: d.last_name,
  email: d.email,
  phone: d.phone ?? null,
  gender: d.gender ?? null,
  dob: formatDateOnly(d.dob),
  country: d.country ?? null,
  state: d.state ?? null,
  city: d.city ?? null,
  current_company: d.current_company ?? null,
  current_position: d.current_position ?? null,
  experience_years: d.experience_years ?? null,
  current_salary: d.current_salary ?? null,
  expected_salary: d.expected_salary ?? null,
  notice_period: d.notice_period ?? null,
  skills: d.skills ?? null,
  education: d.education ?? null,
  portfolio_url: d.portfolio_url ?? null,
  linkedin_url: d.linkedin_url ?? null,
  profile_path: d.profile_path ?? null,
  resume_path: d.resume_path ?? null,
  cover_letter_path: d.cover_letter_path ?? null,
  status: d.status,
  application_date: formatDateOnly(d.application_date),
  custom_question: d.custom_question ?? null,
  job_id: refName(d.job_id, "title"),
  source_id: refName(d.source_id),
  createdAt: d.createdAt,
});

const base = createRecruitmentCrudService<TCandidate>({
  model: CandidateModel,
  label: "Candidate",
  perms: { manageAny: P.manage_any_candidates, manageOwn: P.manage_own_candidates },
  searchFields: ["first_name", "last_name", "email", "tracking_id", "phone"],
  populate,
  beforeCreate: prepareCreate,
  beforeUpdate: prepareUpdate,
  formatItem: format,
});

/** updateStatus: candidate pipeline stage (New/Shortlisted/Interview/Offer/Hired/Rejected). */
const updateStatus = async (req: AuthRequest, id: string, status: unknown) => {
  const s = String(status);
  if (!(candidateStatuses as readonly string[]).includes(s)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status. Allowed: ${candidateStatuses.join(", ")}`
    );
  }
  const doc = await base.getOwned(req, id);
  doc.status = s;
  await doc.save();
  return format(doc as unknown as TCandidate);
};

export const candidateService = { ...base, updateStatus };
