import { Schema, model } from "mongoose";
import { TIndicatorCategory } from "./indicatorCategory.interface";
import { performanceBaseFields } from "../performance.utils";

const indicatorCategorySchema = new Schema<TIndicatorCategory>(
  {
    ...performanceBaseFields,
    name: { type: String, required: true, trim: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const IndicatorCategoryModel = model<TIndicatorCategory>(
  "PerformanceIndicatorCategory",
  indicatorCategorySchema
);
