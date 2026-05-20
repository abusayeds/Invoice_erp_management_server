import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import { IOTP, IUser } from "./user.interface";
import { role } from "../../../utils/role";
import { TBusinessAddress } from "./user.business.interface";

const addressSchema = new Schema<TBusinessAddress>(
  {
    street: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const businessProfileSchema = new Schema(
  {
    companyName: { type: String, trim: true },
    reg_no: { type: String },
    tax_id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    BusinessPhone: { type: String },
    fax: { type: String },
    mobile: { type: String },
    home_phone: { type: String },
    address: { type: addressSchema },
    billingAddress: { type: addressSchema },
    bank_details: { type: String },
    tax_service: { type: String },
    tax_product: { type: String },
    hourly_rate: { type: String },
    payment_terms_seles: { type: String },
    opening_balance: { type: Number, default: 0 },
    opening_balance_date: { type: Date },
    notes: { type: String },
    payment_reminder: { type: Boolean, default: false },
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
      enum: [...Object.values(role), "client"],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    businessProfile: { type: businessProfileSchema },
    permissions: [{ type: String }],
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    login: {
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
