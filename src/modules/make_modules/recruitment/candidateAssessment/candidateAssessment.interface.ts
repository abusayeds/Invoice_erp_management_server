import { Types } from "mongoose";

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
