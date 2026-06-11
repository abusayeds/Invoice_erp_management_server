import { Schema, model } from "mongoose";
import { TJobPosting } from "./jobPosting.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const jobPostingSchema = new Schema<TJobPosting>(
  {
    ...recruitmentBaseFields,
    code: { type: String },
    posting_code: { type: String },
    title: { type: String, required: true, trim: true },
    position: { type: Number },
    priority: { type: String, default: "0" },
    job_application: { type: String, default: "existing" },
    application_url: { type: String },
    min_experience: { type: Number },
    max_experience: { type: Number },
    min_salary: { type: Number },
    max_salary: { type: Number },
    description: { type: String },
    requirements: { type: String },
    skills: { type: [String], default: [] },
    benefits: { type: String },
    terms_condition: { type: String },
    show_terms_condition: { type: Boolean, default: false },
    application_deadline: { type: String },
    is_published: { type: Boolean, default: false },
    publish_date: { type: String },
    is_featured: { type: Boolean, default: false },
    status: { type: String, default: "0" },
    applicant: { type: [String], default: [] },
    visibility: { type: [String], default: [] },
    custom_questions: [{ type: Schema.Types.ObjectId, ref: "RecruitmentCustomQuestion" }],
    branch_id: { type: Schema.Types.ObjectId, ref: "HrmBranch" },
    job_type_id: { type: Schema.Types.ObjectId, ref: "RecruitmentJobType" },
    location_id: { type: Schema.Types.ObjectId, ref: "RecruitmentJobLocation" },
  },
  { timestamps: true }
);

export const JobPostingModel = model<TJobPosting>("RecruitmentJobPosting", jobPostingSchema);
