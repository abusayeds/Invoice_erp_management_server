import { Schema, model } from "mongoose";
import { TGoalCategory } from "../goal.types";

const schema = new Schema<TGoalCategory>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    category_name: { type: String, required: true, trim: true },
    category_code: { type: String, required: true, trim: true },
    description: { type: String },
    is_active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ user_id: 1, category_code: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

export const GoalCategoryModel = model<TGoalCategory>("GoalCategory", schema);
