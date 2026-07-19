import { Schema, model } from "mongoose";
import { TPerformanceIndicator } from "./indicator.interface";
import { performanceBaseFields } from "../performance.utils";

const indicatorSchema = new Schema<TPerformanceIndicator>(
  {
    ...performanceBaseFields,
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "PerformanceIndicatorCategory",
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    measurement_unit: { type: String },
    target_value: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const PerformanceIndicatorModel = model<TPerformanceIndicator>(
  "PerformanceIndicator",
  indicatorSchema
);
