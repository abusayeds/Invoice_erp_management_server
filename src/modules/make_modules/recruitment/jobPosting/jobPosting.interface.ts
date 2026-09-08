import { Types } from "mongoose";

/** Job posting enums (readable — replace the old 0/1/2 codes). */
export const jobPostingPriorities = ["Low", "Medium", "High"] as const;
export const jobPostingStatuses = ["Draft", "Active", "Closed"] as const;
export const jobApplicationTypes = ["existing", "custom"] as const;
export type TJobPostingPriority = (typeof jobPostingPriorities)[number];
export type TJobPostingStatus = (typeof jobPostingStatuses)[number];

export type TJobPosting = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  code?: string;
  posting_code?: string;
  title: string;
  position?: number;
  priority: string;
  job_application: string;
  application_url?: string;
  min_experience?: number;
  max_experience?: number;
  min_salary?: number;
  max_salary?: number;
  description?: string;
  requirements?: string;
  skills?: string[];
  benefits?: string;
  terms_condition?: string;
  show_terms_condition: boolean;
  application_deadline?: string;
  is_published: boolean;
  publish_date?: string;
  is_featured: boolean;
  status: string;
  applicant?: string[];
  visibility?: string[];
  custom_questions?: Types.ObjectId[];
  branch_id?: Types.ObjectId;
  job_type_id?: Types.ObjectId;
  location_id?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
