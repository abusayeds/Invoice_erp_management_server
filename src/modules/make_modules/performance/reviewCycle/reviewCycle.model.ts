import { Schema, model } from "mongoose";
import { TPerformanceReviewCycle } from "./reviewCycle.interface";
import { performanceBaseFields } from "../performance.utils";

const reviewCycleSchema = new Schema<TPerformanceReviewCycle>(
  {
    ...performanceBaseFields,
    name: { type: String, required: true, trim: true },
    frequency: {
      type: String,
      enum: ["monthly", "quarterly", "semi-annual", "annual"],
      required: true,
    },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const PerformanceReviewCycleModel = model<TPerformanceReviewCycle>(
  "PerformanceReviewCycle",
  reviewCycleSchema
);
