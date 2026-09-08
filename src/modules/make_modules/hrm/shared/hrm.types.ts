import { Document, Types } from "mongoose";

export type THrmBase = {
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  isDeleted: boolean;
};

export type THrmDoc = THrmBase & Document;

export const EMPLOYMENT_TYPES = ["0", "1", "2", "3"] as const;
export const GENDERS = ["Male", "Female", "Other", "0", "1", "2"] as const;

export type LeaveStatus = "pending" | "approved" | "rejected";
export type AttendanceStatus = "present" | "half day" | "absent";
export type PayrollFrequency = "weekly" | "biweekly" | "monthly";
export type PayrollStatus = "draft" | "processing" | "completed" | "cancelled";
export type PayslipStatus = "paid" | "unpaid";
export type AmountType = "fixed" | "percentage";
