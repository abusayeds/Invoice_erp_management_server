import { Schema, model } from "mongoose";
import { TPerformanceEmployeeReview } from "./employeeReview.interface";
import { performanceBaseFields } from "../performance.utils";

const employeeReviewSchema = new Schema<TPerformanceEmployeeReview>(
  {
    ...performanceBaseFields,
    employee_user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    reviewer_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    review_cycle_id: {
      type: Schema.Types.ObjectId,
      ref: "PerformanceReviewCycle",
      required: true,
      index: true,
    },
    review_date: { type: Date, required: true },
    completion_date: { type: Date },
    rating: { type: Schema.Types.Mixed, default: {} },
    pros: { type: String },
    cons: { type: String },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Laravel: getAverageRatingAttribute => mean of rated values (> 0), 1 decimal.
employeeReviewSchema.virtual("average_rating").get(function () {
  const self = this as unknown as TPerformanceEmployeeReview;
  const rating = self.rating;
  if (!rating || typeof rating !== "object") return null;
  const rated = Object.values(rating)
    .map((v) => Number(v))
    .filter((v) => !Number.isNaN(v) && v > 0);
  if (rated.length === 0) return null;
  return Math.round((rated.reduce((a, b) => a + b, 0) / rated.length) * 10) / 10;
});

export const PerformanceEmployeeReviewModel = model<TPerformanceEmployeeReview>(
  "PerformanceEmployeeReview",
  employeeReviewSchema
);
