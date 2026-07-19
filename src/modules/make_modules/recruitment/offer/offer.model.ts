import { Schema, model } from "mongoose";
import { TOffer, offerStatuses, offerApprovalStatuses } from "./offer.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const offerSchema = new Schema<TOffer>(
  {
    ...recruitmentBaseFields,
    candidate_id: { type: Schema.Types.ObjectId, ref: "RecruitmentCandidate", required: true, index: true },
    job_id: { type: Schema.Types.ObjectId, ref: "RecruitmentJobPosting", index: true },
    offer_date: { type: Date, required: true },
    position: { type: String, required: true },
    department_id: { type: Schema.Types.ObjectId, ref: "HrmDepartment" },
    salary: { type: Number, required: true },
    bonus: { type: Number },
    equity: { type: String },
    benefits: { type: String },
    start_date: { type: Date, required: true },
    expiration_date: { type: Date, required: true },
    offer_letter_path: { type: String },
    status: { type: String, enum: offerStatuses, default: "Pending" },
    response_date: { type: Date },
    decline_reason: { type: String },
    converted_to_employee: { type: Boolean, default: false },
    employee_id: { type: Schema.Types.ObjectId, ref: "HrmEmployee" },
    approved_by: { type: Schema.Types.ObjectId, ref: "User" },
    approval_status: { type: String, enum: offerApprovalStatuses, default: "Pending" },
  },
  { timestamps: true }
);

export const OfferModel = model<TOffer>("RecruitmentOffer", offerSchema);
