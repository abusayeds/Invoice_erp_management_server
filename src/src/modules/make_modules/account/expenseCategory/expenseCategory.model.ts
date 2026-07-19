import { Schema, model } from "mongoose";
import { TExpenseCategory } from "./expenseCategory.interface";

const schema = new Schema<TExpenseCategory>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    category_name: { type: String, required: true, trim: true },
    category_code: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    is_active: { type: Boolean, default: true },
    gl_account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ user_id: 1, category_code: 1 }, { unique: true });

export const ExpenseCategoryModel = model<TExpenseCategory>("AccountExpenseCategory", schema);
