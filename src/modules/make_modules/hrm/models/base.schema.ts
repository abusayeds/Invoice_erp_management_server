import { Schema } from "mongoose";

export const hrmBaseSchemaFields = {
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  creator_id: { type: Schema.Types.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false },
};
