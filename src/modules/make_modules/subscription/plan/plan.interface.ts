import { Types } from "mongoose";

/**
 * Dynamic subscription plan (admin-defined catalog).
 * Replaces the old fixed free/monthly/yearly subscription.
 */
export type TPlan = {
  _id?: Types.ObjectId;
  name: string;
  description?: string;

  // Pricing per billing cycle
  price_monthly: number;
  price_yearly: number;

  // Flags
  free_plan: boolean;
  trial: boolean;
  trial_days: number;
  status: boolean; // visible / available

  // Limits
  number_of_users: number; // -1 = unlimited
  /** resourceKey -> max count (-1 = unlimited). e.g. { customers: 50, vendors: 20 } */
  limits: Record<string, number>;

  // Enabled feature modules (keys from MODULE_CATALOG). e.g. ["hrm","account"]
  modules: string[];

  created_by?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
