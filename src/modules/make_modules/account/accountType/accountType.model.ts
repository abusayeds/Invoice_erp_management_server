import { Schema, model } from "mongoose";
import { normalBalanceValues, TAccountType } from "./accountType.interface";

const schema = new Schema<TAccountType>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    category_id: { type: Schema.Types.ObjectId, ref: "AccountCategory", required: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    normal_balance: { type: String, enum: normalBalanceValues, required: true },
    description: { type: String, trim: true },
    is_active: { type: Boolean, default: true },
    is_system_type: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ user_id: 1, code: 1 }, { unique: true });

export const AccountTypeModel = model<TAccountType>("AccountType", schema);
