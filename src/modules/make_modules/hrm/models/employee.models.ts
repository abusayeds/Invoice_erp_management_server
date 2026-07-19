import { Schema, model, Types, Document } from "mongoose";
import { THrmBase } from "../shared/hrm.types";
import { hrmBaseSchemaFields } from "./base.schema";

type Doc<T> = T & THrmBase & Document;

export type THrmEmployee = Doc<{
  employee_id: string;
  date_of_birth?: Date;
  gender: string;
  shift_id?: Types.ObjectId;
  attendance_policy?: string;
  date_of_joining?: Date;
  employment_type: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_number?: string;
  bank_name?: string;
  account_holder_name?: string;
  account_number?: string;
  bank_identifier_code?: string;
  bank_branch?: string;
  tax_payer_id?: string;
  basic_salary?: number;
  hours_per_day?: number;
  days_per_week?: number;
  rate_per_hour?: number;
  employee_user_id: Types.ObjectId;
  branch_id?: Types.ObjectId;
  department_id?: Types.ObjectId;
  designation_id?: Types.ObjectId;
}>;

const employeeSchema = new Schema({
  ...hrmBaseSchemaFields,
  employee_id: { type: String, required: true },
  date_of_birth: Date,
  gender: { type: String, default: "Male" },
  shift_id: { type: Schema.Types.ObjectId, ref: "HrmShift" },
  attendance_policy: String,
  date_of_joining: Date,
  employment_type: { type: String, default: "0" },
  address_line_1: String,
  address_line_2: String,
  city: String,
  state: String,
  country: String,
  postal_code: String,
  emergency_contact_name: String,
  emergency_contact_relationship: String,
  emergency_contact_number: String,
  bank_name: String,
  account_holder_name: String,
  account_number: String,
  bank_identifier_code: String,
  bank_branch: String,
  tax_payer_id: String,
  basic_salary: Number,
  hours_per_day: Number,
  days_per_week: Number,
  rate_per_hour: Number,
  employee_user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  branch_id: { type: Schema.Types.ObjectId, ref: "HrmBranch" },
  department_id: { type: Schema.Types.ObjectId, ref: "HrmDepartment" },
  designation_id: { type: Schema.Types.ObjectId, ref: "HrmDesignation" },
}, { timestamps: true });
employeeSchema.index({ employee_user_id: 1, user_id: 1 }, { unique: true });
employeeSchema.index({ employee_id: 1, user_id: 1 }, { unique: true });

export const HrmEmployeeModel = model<THrmEmployee>("HrmEmployee", employeeSchema, "hrmemployees");

export type THrmEmployeeDocument = Doc<{
  employee_profile_id: Types.ObjectId;
  document_type_id: Types.ObjectId;
  file_path: string;
}>;

export const HrmEmployeeDocumentModel = model<THrmEmployeeDocument>(
  "HrmEmployeeDocument",
  new Schema({
    ...hrmBaseSchemaFields,
    employee_profile_id: { type: Schema.Types.ObjectId, ref: "HrmEmployee", required: true },
    document_type_id: { type: Schema.Types.ObjectId, ref: "HrmEmployeeDocumentType", required: true },
    file_path: { type: String, required: true },
  }, { timestamps: true }),
  "hrmemployeedocuments"
);
