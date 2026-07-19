import { Schema, model } from "mongoose";
import { TPerformanceGoalType } from "./goalType.interface";
import { performanceBaseFields } from "../performance.utils";

const goalTypeSchema = new Schema<TPerformanceGoalType>(
  {
    ...performanceBaseFields,
    name: { type: String, required: true, trim: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const PerformanceGoalTypeModel = model<TPerformanceGoalType>(
  "PerformanceGoalType",
  goalTypeSchema
);
