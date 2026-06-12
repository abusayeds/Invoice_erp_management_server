import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import { IOTP, IUser } from "./user.interface";
import { role } from "../../../utils/role";
import { TPartyAddress } from "./user.business.interface";

const addressSchema = new Schema<TPartyAddress>(
  {
    name: { type: String },
    address_line_1: { type: String },
    address_line_2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip_code: { type: String },
  },
  { _id: false }
);

// Customer/Vendor business data — only the fields the Laravel forms collect.
const businessProfileSchema = new Schema(
  {
    companyName: { type: String, trim: true },
    tax_number: { type: String },
    payment_terms: { type: String },
    billing_address: { type: addressSchema },
    shipping_address: { type: addressSchema },
    same_as_billing: { type: Boolean, default: false },
    notes: { type: String },
    active: { type: Boolean, default: true },
    archive: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    email: { type: String, required: false, unique: true, sparse: true, trim: true },
    password: {
      type: String,
      required: function (this: IUser) {
        if (this.authProvider === "google") return false;
        // Customer/vendor are data records (Laravel collects no password for them).
        if (this.role === role.customer || this.role === role.vendor) return false;
        return true;
      },
      minlength: 3,
      set: (v: string) => {
        if (!v) return v;
        return bcrypt.hashSync(v, bcrypt.genSaltSync(Number(12)));
      },
      select: 0,
    },
    phone: { type: String, trim: true },
    language: { type: String, trim: true },
    currency: { type: String, trim: true },
    country: { type: String, trim: true },
    address: { type: String },
    image: { type: String, trim: true },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: [...Object.values(role), ],
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    businessProfile: { type: businessProfileSchema },
    permissions: [{ type: String }],
    // Hidden by default so existing responses (my-profile/login) stay unchanged; auth loads it explicitly.
    permissionsOverridden: { type: Boolean, default: false, select: false },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerify: {
      type: Boolean,
      default: true,
    },
    login: {
      type: Boolean,
      default: true,
    },
    is_trial_done: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true, trim: true },
  otp: { type: String, required: true, trim: true },
  expiresAt: { type: Date, required: true },
});

export const OTPModel = mongoose.model<IOTP>("OTP", OTPSchema);
