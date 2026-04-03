import { model, Schema } from "mongoose";
import { TCompany } from "./conmapy.interface";

const addressSchema = new Schema(
  {
    street1: { type: String, default: "" },
    street2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  { _id: false }
);

const companySchema = new Schema<TCompany>(
  { 
    user_id : { type: Schema.Types.ObjectId, required: true, ref: "User" },
    companyLogo: { type: String, default: "" },
    businessName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    mobile: { type: String, default: "" },
    fax: { type: String, default: "" },
    website: { type: String, default: "" },
    billingAddress: { type: addressSchema, default: () => ({}) },
    shippingAddress: { type: addressSchema, default: () => ({}) },
    reg_No: { type: String, default: "" },
    tax_id: { type: String, default: "" },
    payment_terms_seles: { type: String, default: "" },
    payment_terms_purchase: { type: String, default: "" },
    financialYear: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Company = model<TCompany>("Company", companySchema);