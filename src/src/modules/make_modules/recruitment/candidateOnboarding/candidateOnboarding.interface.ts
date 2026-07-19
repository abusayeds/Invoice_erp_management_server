import { Types } from "mongoose";

export const candidateOnboardingStatus = ["Pending", "In Progress", "Completed"] as const;
export type TCandidateOnboardingStatus = (typeof candidateOnboardingStatus)[number];

export type TCandidateOnboarding = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  start_date: Date;
  status: TCandidateOnboardingStatus;
  candidate_id: Types.ObjectId;
  checklist_id: Types.ObjectId;
  buddy_employee_id?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
