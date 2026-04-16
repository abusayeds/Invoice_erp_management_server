import { Schema, model, Types } from "mongoose";
import { TAddress, TVendor } from "./vendor.interface";

const addressSchema = new Schema<TAddress>(
  {
    street: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false } 
);

const ventorSchema = new Schema<TVendor>(
  {
    user_id: { type: Types.ObjectId, ref: "User" },

    companyName: { type: String, required: true },
    email: { type: String, required: true },

    reg_no: { type: String },
    tax_id: { type: String },

    firstName: { type: String },
    lastName: { type: String },

    BusinessPhone: { type: String },
    fax: { type: String },
    mobile: { type: String },
    home_phone: { type: String },

    address: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema, required: true },

    bank_details: { type: String },
    currency: { type: String },
    tax_service: { type: String },
    tax_product: { type: String },

    hourly_rate: { type: String },
    payment_terms_seles: { type: String },

    opening_balance: { type: Number, default: 0 },
    opening_balance_date: { type: Date },

    notes: { type: String },

    payment_reminder: { type: Boolean, default: false },

    custormer: { type: Boolean, default: false }, 
    vendor: { type: Boolean, default: false },

    active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    archive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);


export const VendorModel = model<TVendor>(
  "Vendor",
  ventorSchema
);