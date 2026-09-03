import { Schema, model } from "mongoose";
import { TCandidate, candidateStatuses } from "./candidate.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const candidateSchema = new Schema<TCandidate>(
  {
    ...recruitmentBaseFields,
    tracking_id: { type: String, index: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    gender: { type: String },
    dob: { type: Date },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    current_company: { type: String },
    current_position: { type: String },
    experience_years: { type: Number },
    current_salary: { type: Number },
    expected_salary: { type: Number },
    notice_period: { type: String },
    skills: { type: String },
    education: { type: String },
    portfolio_url: { type: String },
    linkedin_url: { type: String },
    profile_path: { type: String },
    resume_path: { type: String },
    cover_letter_path: { type: String },
    status: { type: String, enum: candidateStatuses, default: "New" },
    application_date: { type: Date },
    custom_question: { type: Schema.Types.Mixed },
    job_id: { type: Schema.Types.ObjectId, ref: "RecruitmentJobPosting", index: true },
    source_id: { type: Schema.Types.ObjectId, ref: "RecruitmentCandidateSource", index: true },
    candidate_user_id: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const CandidateModel = model<TCandidate>("RecruitmentCandidate", candidateSchema);
