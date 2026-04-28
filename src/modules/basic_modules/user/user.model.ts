import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import { IOTP, IUser } from "./user.interface";
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    email: { type: String, required: false, unique: true, trim: true },
    password: {
      type: String,
      required: [true, "Password is required",],
      minlength: 3,
      set: (v: string) => bcrypt.hashSync(v, bcrypt.genSaltSync(Number(12))
      ),
      select: 0
    },
    phone: { type: String, trim: true, },
    language: { type: String, trim: true, },
    currency: { type: String, trim: true, },
    country: { type: String, trim: true, },
    address: { type: String,  },
    image: { type: String, trim: true, },
    authProvider : {
      type: String,
      enum: ["local", "google"],
      default: "local",
    }  ,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    subscriptionId : {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
    } ,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerify: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },

);



export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true, trim: true },
  otp: { type: String, required: true, trim: true },
  expiresAt: { type: Date, required: true },
});

export const OTPModel = mongoose.model<IOTP>("OTP", OTPSchema);
