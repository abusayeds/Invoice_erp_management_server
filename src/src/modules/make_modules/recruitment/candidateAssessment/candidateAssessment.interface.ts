import { Types } from "mongoose";

/** Assessment result (readable enum — replaces the old 0 code). */
export const assessmentPassFailStatuses = ["Pending", "Pass", "Fail"] as const;
export type TAssessmentPassFailStatus = (typeof assessmentPassFailStatuses)[number];

export type TCandidateAssessment = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  assessment_name: string;
  score?: number;
  max_score?: number;
  pass_fail_status: string;
  comments?: string;
  assessment_date?: Date;
  candidate_id?: Types.ObjectId;
  conducted_by?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
