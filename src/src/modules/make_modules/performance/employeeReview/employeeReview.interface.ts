import { Types } from "mongoose";

export type TEmployeeReviewStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

/** indicator_id (string) -> rating score (1-5). Mirrors Laravel JSON `rating` column. */
export type TReviewRatings = Record<string, number>;

export type TPerformanceEmployeeReview = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  /** The employee being reviewed (Laravel employee_reviews.user_id). */
  employee_user_id: Types.ObjectId;
  reviewer_id: Types.ObjectId;
  review_cycle_id: Types.ObjectId;
  review_date: Date;
  completion_date?: Date;
  rating?: TReviewRatings;
  pros?: string;
  cons?: string;
  status: TEmployeeReviewStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
