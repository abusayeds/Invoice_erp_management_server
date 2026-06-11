import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { companyObjectId, generateSequentialCode, parseDate, refName } from "../recruitment.utils";
import { JobPostingModel } from "../jobPosting/jobPosting.model";
import { CandidateModel } from "../candidate/candidate.model";
import { CandidateSourceModel } from "../candidateSource/candidateSource.model";
import { OfferModel } from "../offer/offer.model";
import { InterviewModel } from "../interview/interview.model";

const validCompany = (companyId: string) => {
  if (!Types.ObjectId.isValid(companyId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid company");
  }
  return companyObjectId(companyId);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const publicJob = (d: any) => ({
  _id: d._id,
  posting_code: d.posting_code ?? null,
  title: d.title,
  job_type: refName(d.job_type_id),
  location: refName(d.location_id),
  min_experience: d.min_experience ?? null,
  max_experience: d.max_experience ?? null,
  min_salary: d.min_salary ?? null,
  max_salary: d.max_salary ?? null,
  description: d.description ?? null,
  requirements: d.requirements ?? null,
  skills: d.skills ?? [],
  benefits: d.benefits ?? null,
  application_deadline: d.application_deadline ?? null,
  is_featured: d.is_featured,
  show_terms_condition: d.show_terms_condition,
  terms_condition: d.terms_condition ?? null,
  custom_questions: d.custom_questions ?? [],
  createdAt: d.createdAt,
});

const jobListings = async (companyId: string) => {
  const user_id = validCompany(companyId);
  const jobs = await JobPostingModel.find({
    user_id,
    is_published: true,
    status: "active",
    isDeleted: false,
  })
    .populate([
      { path: "job_type_id", select: "name" },
      { path: "location_id", select: "name" },
    ])
    .sort({ createdAt: -1 });
  return jobs.map(publicJob);
};

const jobDetails = async (companyId: string, jobId: string) => {
  const user_id = validCompany(companyId);
  if (!Types.ObjectId.isValid(jobId)) throw new AppError(httpStatus.BAD_REQUEST, "Invalid job");
  const job = await JobPostingModel.findOne({ _id: jobId, user_id, is_published: true, isDeleted: false }).populate([
    { path: "job_type_id", select: "name" },
    { path: "location_id", select: "name" },
    { path: "custom_questions", select: "question type options is_required sort_order" },
  ]);
  if (!job) throw new AppError(httpStatus.NOT_FOUND, "Job not found or no longer available");
  return publicJob(job);
};

const submitApplication = async (companyId: string, jobId: string, body: Record<string, unknown>) => {
  const user_id = validCompany(companyId);
  if (!Types.ObjectId.isValid(jobId)) throw new AppError(httpStatus.BAD_REQUEST, "Invalid job");
  const job = await JobPostingModel.findOne({ _id: jobId, user_id, is_published: true, isDeleted: false });
  if (!job) throw new AppError(httpStatus.NOT_FOUND, "Job not found or no longer accepting applications");

  if (!body.email || !body.name) {
    throw new AppError(httpStatus.BAD_REQUEST, "Name and email are required");
  }
  const email = String(body.email).trim().toLowerCase();
  if (await CandidateModel.findOne({ user_id, email, isDeleted: false })) {
    throw new AppError(httpStatus.CONFLICT, "You have already applied with this email");
  }

  // Career Portal source (find or create) — Laravel CandidateSources 'Career Portal'.
  let source = await CandidateSourceModel.findOne({ user_id, name: "Career Portal", isDeleted: false });
  if (!source) {
    source = await CandidateSourceModel.create({ user_id, name: "Career Portal", is_active: true, isDeleted: false });
  }

  const parts = String(body.name).trim().split(/\s+/);
  const first_name = (body.first_name as string) || parts[0];
  const last_name = (body.last_name as string) || (parts.slice(1).join(" ") || "N/A");

  const tracking_id = await generateSequentialCode(CandidateModel, companyId, "TRK", "tracking_id");

  const candidate = await CandidateModel.create({
    user_id,
    tracking_id,
    first_name,
    last_name,
    email,
    phone: body.phone,
    gender: body.gender,
    dob: body.dateOfBirth ? parseDate(body.dateOfBirth, "date of birth") : undefined,
    country: body.country,
    state: body.state,
    city: body.city,
    current_company: body.currentCompany,
    current_position: body.currentPosition,
    experience_years: body.experienceYears,
    current_salary: body.currentSalary,
    expected_salary: body.expectedSalary,
    notice_period: body.noticePeriod,
    skills: body.skills,
    education: body.education,
    portfolio_url: body.portfolioUrl,
    linkedin_url: body.linkedinUrl,
    profile_path: body.profilePhoto,
    resume_path: body.resume,
    cover_letter_path: body.coverLetter,
    status: "0",
    application_date: new Date(),
    custom_question: body.custom_question ?? body.customAnswers ?? null,
    job_id: job._id,
    source_id: source._id,
    isDeleted: false,
  });

  return { tracking_id, candidate_id: candidate._id, message: "Application submitted successfully" };
};

const STATUS_LABELS: Record<string, string> = {
  "0": "Applied",
  "1": "Shortlisted",
  "2": "Interview Scheduled",
  "3": "Offer Extended",
  "4": "Hired",
  "5": "Rejected",
};

const trackingVerify = async (companyId: string, body: Record<string, unknown>) => {
  const user_id = validCompany(companyId);
  const tracking_id = String(body.tracking_id || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  if (!tracking_id || !email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tracking ID and email are required");
  }
  const candidate = await CandidateModel.findOne({ user_id, tracking_id, email, isDeleted: false });
  if (!candidate) throw new AppError(httpStatus.NOT_FOUND, "No application found with these details");
  return {
    tracking_id: candidate.tracking_id,
    name: `${candidate.first_name} ${candidate.last_name}`,
    status: candidate.status,
    status_label: STATUS_LABELS[candidate.status] ?? candidate.status,
  };
};

const trackingDetails = async (companyId: string, trackingId: string) => {
  const user_id = validCompany(companyId);
  const candidate = await CandidateModel.findOne({ user_id, tracking_id: trackingId, isDeleted: false }).populate({
    path: "job_id",
    select: "title posting_code",
  });
  if (!candidate) throw new AppError(httpStatus.NOT_FOUND, "Application not found");

  const interviews = await InterviewModel.find({ user_id, candidate_id: candidate._id, isDeleted: false })
    .select("scheduled_date scheduled_time status location meeting_link")
    .sort({ createdAt: -1 });
  const offer = await OfferModel.findOne({ user_id, candidate_id: candidate._id, isDeleted: false }).sort({ createdAt: -1 });

  return {
    tracking_id: candidate.tracking_id,
    name: `${candidate.first_name} ${candidate.last_name}`,
    email: candidate.email,
    job: refName(candidate.job_id, "title"),
    status: candidate.status,
    status_label: STATUS_LABELS[candidate.status] ?? candidate.status,
    application_date: candidate.application_date,
    interviews,
    offer: offer
      ? {
          _id: offer._id,
          position: offer.position,
          salary: offer.salary,
          start_date: offer.start_date,
          status: offer.status,
          expiration_date: offer.expiration_date,
        }
      : null,
  };
};

/** Laravel offerResponse: 2=accepted, 4=declined. */
const offerResponse = async (companyId: string, offerId: string, body: Record<string, unknown>) => {
  const user_id = validCompany(companyId);
  if (!Types.ObjectId.isValid(offerId)) throw new AppError(httpStatus.BAD_REQUEST, "Invalid offer");
  const status = String(body.status);
  if (!["2", "4"].includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Status must be 2 (accepted) or 4 (declined)");
  }
  const offer = await OfferModel.findOne({ _id: offerId, user_id, isDeleted: false });
  if (!offer) throw new AppError(httpStatus.NOT_FOUND, "Offer not found");

  offer.status = status;
  offer.response_date = new Date();
  if (status === "4" && body.decline_reason) offer.decline_reason = String(body.decline_reason);
  await offer.save();

  return {
    _id: offer._id,
    status: offer.status,
    response_date: offer.response_date,
    message: status === "2" ? "Offer accepted successfully" : "Offer declined",
  };
};

export const careersService = {
  jobListings,
  jobDetails,
  submitApplication,
  trackingVerify,
  trackingDetails,
  offerResponse,
};
