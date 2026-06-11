import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import {
  assertCompanyRef,
  assertHrmBranch,
  generateSequentialCode,
  refName,
  resolveCompanyId,
} from "../recruitment.utils";
import { JobTypeModel } from "../jobType/jobType.model";
import { JobLocationModel } from "../jobLocation/jobLocation.model";
import { JobPostingModel } from "./jobPosting.model";
import { TJobPosting } from "./jobPosting.interface";

const P = permission.recruitment.job_postings;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normArray = (v: any): unknown[] =>
  Array.isArray(v) ? v : v === undefined || v === null || v === "" ? [] : [v];

const validateRefs = async (body: Record<string, unknown>, companyId: string) => {
  await assertHrmBranch(body.branch_id, companyId);
  await assertCompanyRef(JobTypeModel, body.job_type_id, companyId, "Job type");
  await assertCompanyRef(JobLocationModel, body.location_id, companyId, "Job location");
};

const ARRAY_FIELDS = ["skills", "applicant", "visibility", "custom_questions"];

const prepareCreate = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  await validateRefs(body, companyId);
  body.code = await generateSequentialCode(JobPostingModel, companyId, "JOB", "code");
  body.posting_code = await generateSequentialCode(JobPostingModel, companyId, "JP", "posting_code");
  ARRAY_FIELDS.forEach((k) => {
    if (body[k] !== undefined) body[k] = normArray(body[k]);
  });
  return body;
};

const prepareUpdate = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  await validateRefs(body, companyId);
  delete body.code;
  delete body.posting_code;
  ARRAY_FIELDS.forEach((k) => {
    if (body[k] !== undefined) body[k] = normArray(body[k]);
  });
  return body;
};

const populate = [
  { path: "branch_id", select: "branch_name" },
  { path: "job_type_id", select: "name" },
  { path: "location_id", select: "name" },
  { path: "custom_questions", select: "question type options is_required" },
];

const format = (d: TJobPosting) => ({
  _id: d._id,
  code: d.code ?? null,
  posting_code: d.posting_code ?? null,
  title: d.title,
  position: d.position ?? null,
  priority: d.priority,
  job_application: d.job_application,
  application_url: d.application_url ?? null,
  branch_id: refName(d.branch_id, "branch_name"),
  job_type_id: refName(d.job_type_id),
  location_id: refName(d.location_id),
  min_experience: d.min_experience ?? null,
  max_experience: d.max_experience ?? null,
  min_salary: d.min_salary ?? null,
  max_salary: d.max_salary ?? null,
  description: d.description ?? null,
  requirements: d.requirements ?? null,
  skills: d.skills ?? [],
  benefits: d.benefits ?? null,
  terms_condition: d.terms_condition ?? null,
  show_terms_condition: d.show_terms_condition,
  application_deadline: d.application_deadline ?? null,
  is_published: d.is_published,
  publish_date: d.publish_date ?? null,
  is_featured: d.is_featured,
  status: d.status,
  applicant: d.applicant ?? [],
  visibility: d.visibility ?? [],
  custom_questions: d.custom_questions ?? [],
  createdAt: d.createdAt,
});

const base = createRecruitmentCrudService<TJobPosting>({
  model: JobPostingModel,
  label: "Job posting",
  perms: { manageAny: P.manage_any_job_postings, manageOwn: P.manage_own_job_postings },
  searchFields: ["title", "code", "posting_code", "description"],
  populate,
  beforeCreate: prepareCreate,
  beforeUpdate: prepareUpdate,
  formatItem: format,
});

/** Laravel togglePublish: draft/0 -> active+published, else -> draft+unpublished. */
const togglePublish = async (req: AuthRequest, id: string) => {
  const doc = await base.getOwned(req, id);
  if (doc.status === "draft" || doc.status === "0") {
    doc.status = "active";
    doc.is_published = true;
  } else {
    doc.status = "draft";
    doc.is_published = false;
  }
  await doc.save();
  return format(doc as unknown as TJobPosting);
};

export const jobPostingService = { ...base, togglePublish };
