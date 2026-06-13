import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import {
  assertCompanyRef,
  assertHrmDepartment,
  companyObjectId,
  companyScope,
  creatorObjectId,
  formatDateOnly,
  generateSequentialCode,
  parseDate,
  refName,
  resolveCompanyId,
} from "../recruitment.utils";
import { CandidateModel } from "../candidate/candidate.model";
import { OfferModel } from "./offer.model";
import { TOffer, offerApprovalStatuses } from "./offer.interface";
import { UserModel } from "../../../basic_modules/user/user.model";
import { HrmEmployeeModel } from "../../hrm/models/employee.models";

const P = permission.recruitment.offers;

const prepare = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  await assertCompanyRef(CandidateModel, body.candidate_id, companyId, "Candidate");
  await assertHrmDepartment(body.department_id, companyId);
  (["offer_date", "start_date", "expiration_date", "response_date"] as const).forEach((k) => {
    if (body[k] !== undefined && body[k] !== null && body[k] !== "") {
      body[k] = parseDate(body[k], k.replace("_", " "));
    }
  });
  return body;
};

const populate = [
  { path: "candidate_id", select: "first_name last_name email" },
  { path: "job_id", select: "title" },
  { path: "department_id", select: "department_name" },
  { path: "approved_by", select: "name" },
];

const format = (d: TOffer) => ({
  _id: d._id,
  candidate_id: refName(d.candidate_id, "first_name"),
  job_id: refName(d.job_id, "title"),
  offer_date: formatDateOnly(d.offer_date),
  position: d.position,
  department_id: refName(d.department_id, "department_name"),
  salary: d.salary,
  bonus: d.bonus ?? null,
  equity: d.equity ?? null,
  benefits: d.benefits ?? null,
  start_date: formatDateOnly(d.start_date),
  expiration_date: formatDateOnly(d.expiration_date),
  offer_letter_path: d.offer_letter_path ?? null,
  status: d.status,
  response_date: formatDateOnly(d.response_date),
  decline_reason: d.decline_reason ?? null,
  converted_to_employee: d.converted_to_employee,
  employee_id: d.employee_id ?? null,
  approval_status: d.approval_status,
  approved_by: refName(d.approved_by),
  createdAt: d.createdAt,
});

const base = createRecruitmentCrudService<TOffer>({
  model: OfferModel,
  label: "Offer",
  perms: { manageAny: P.manage_any_offers, manageOwn: P.manage_own_offers },
  searchFields: ["position", "equity"],
  populate,
  beforeCreate: prepare,
  beforeUpdate: prepare,
  formatItem: format,
});

/** updateApprovalStatus: Approved / Rejected / Pending. Records approver. */
const updateApprovalStatus = async (req: AuthRequest, id: string, status: unknown) => {
  const s = String(status);
  if (!(offerApprovalStatuses as readonly string[]).includes(s)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid approval status. Allowed: ${offerApprovalStatuses.join(", ")}`
    );
  }
  const doc = await base.getOwned(req, id);
  doc.approval_status = s;
  doc.approved_by = creatorObjectId(req);
  await doc.save();
  return format(doc as unknown as TOffer);
};

/** Laravel sendEmail: mark the offer letter as sent (email delivery handled by infra). */
const sendEmail = async (req: AuthRequest, id: string) => {
  const doc = await base.getOwned(req, id);
  doc.status = "Sent";
  await doc.save();
  return format(doc as unknown as TOffer);
};

/** Laravel downloadOfferLetter: return the stored offer-letter file path. */
const downloadOfferLetter = async (req: AuthRequest, id: string) => {
  const doc = await base.getOwned(req, id);
  if (!doc.offer_letter_path) {
    throw new AppError(httpStatus.NOT_FOUND, "No offer letter is attached to this offer");
  }
  return { offer_letter_path: doc.offer_letter_path };
};

/**
 * Laravel convertToEmployee: create a staff User + HRM Employee from the offer,
 * mark the offer converted and the candidate hired.
 */
const convertToEmployee = async (req: AuthRequest, id: string, body: Record<string, unknown>) => {
  const companyId = resolveCompanyId(req);
  const offer = await base.getOwned(req, id);
  if (offer.converted_to_employee) {
    throw new AppError(httpStatus.BAD_REQUEST, "This offer has already been converted to an employee");
  }

  const candidate = await CandidateModel.findOne({ _id: offer.candidate_id, ...companyScope(companyId) });
  if (!candidate) throw new AppError(httpStatus.NOT_FOUND, "Candidate not found for this offer");

  const existingUser = await UserModel.findOne({ email: candidate.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "A user with the candidate's email already exists");
  }

  const user = await UserModel.create({
    name: `${candidate.first_name} ${candidate.last_name}`.trim(),
    email: candidate.email,
    password: (body.password as string) || "Password@123",
    role: role.staff,
    companyId: companyObjectId(companyId),
    isVerify: true,
  });

  const employee_id =
    (body.employee_id as string) ||
    (await generateSequentialCode(HrmEmployeeModel, companyId, "EMP", "employee_id"));

  const employee = await HrmEmployeeModel.create({
    user_id: companyObjectId(companyId),
    creator_id: creatorObjectId(req),
    employee_user_id: user._id,
    employee_id,
    branch_id: body.branch_id,
    department_id: offer.department_id ?? body.department_id,
    designation_id: body.designation_id,
    basic_salary: offer.salary,
    date_of_joining: offer.start_date,
  });

  offer.converted_to_employee = true;
  offer.employee_id = employee._id as Types.ObjectId;
  await offer.save();

  candidate.status = "Hired";
  await candidate.save();

  return { offer: format(offer as unknown as TOffer), employee };
};

export const offerService = {
  ...base,
  updateApprovalStatus,
  sendEmail,
  downloadOfferLetter,
  convertToEmployee,
};
