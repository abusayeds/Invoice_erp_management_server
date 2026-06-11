import { Schema, model } from "mongoose";
import { TJobLocation } from "./jobLocation.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const jobLocationSchema = new Schema<TJobLocation>(
  {
    ...recruitmentBaseFields,
    name: { type: String, required: true, trim: true },
    remote_work: { type: Boolean, default: false },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postal_code: { type: String },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JobLocationModel = model<TJobLocation>("RecruitmentJobLocation", jobLocationSchema);
