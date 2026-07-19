import { Schema, model } from "mongoose";
import { TAccountCategory } from "./accountCategory.interface";

const schema = new Schema<TAccountCategory>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    type: { type: String, trim: true },
    description: { type: String, trim: true },
    is_active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ user_id: 1, code: 1 }, { unique: true });

export const AccountCategoryModel = model<TAccountCategory>("AccountCategory", schema);
