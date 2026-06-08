import { Schema, model } from "mongoose";
import { TPlan } from "./plan.interface";

const planSchema = new Schema<TPlan>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },

    price_monthly: { type: Number, default: 0 },
    price_yearly: { type: Number, default: 0 },

    free_plan: { type: Boolean, default: false },
    trial: { type: Boolean, default: false },
    trial_days: { type: Number, default: 0 },
    status: { type: Boolean, default: true },

    number_of_users: { type: Number, default: 1 }, 

    limits: { type: Map, of: Number, default: {} },

    modules: [{ type: String }],

    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PlanModel = model<TPlan>("Plan", planSchema);
