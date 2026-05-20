import { Document, Types } from "mongoose";
import { TRole } from "../../../utils/role";
import { TBusinessProfile } from "./user.business.interface";

export type IPendingUser = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  role: TRole;
} & Document;

export type TPermissions = string[];

export type IUser = {
  name?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  language?: string;
  currency?: string;
  country?: string;
  address?: string;
  image?: string;
  authProvider?: "local" | "google";
  role: TRole;
  subscriptionId?: Types.ObjectId | null;
  companyId?: Types.ObjectId | null;
  businessProfile?: TBusinessProfile;
  permissions?: TPermissions;
  isDeleted: boolean;
  isVerify: boolean; 
  login: boolean;
} & Document;

export type IOTP = {
  email: string;
  otp: string;
  expiresAt: Date;
} & Document;
