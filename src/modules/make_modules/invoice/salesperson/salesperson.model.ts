import { Schema, model } from "mongoose";
import { TSalesperson, salespersonStatus } from "./salesperson.interface";

const salespersonSchema = new Schema<TSalesperson>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: { type: String, trim: true },
    status: { type: String, enum: salespersonStatus, default: "Active" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const SalespersonModel = model<TSalesperson>("Salesperson", salespersonSchema);
