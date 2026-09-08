import { Schema, model, Types, Document } from "mongoose";
import { THrmBase } from "../shared/hrm.types";
import { hrmBaseSchemaFields } from "./base.schema";

type Doc<T> = T & THrmBase & Document;

export type THrmBranch = Doc<{ branch_name: string }>;
const branchSchema = new Schema({ ...hrmBaseSchemaFields, branch_name: { type: String, required: true, trim: true } }, { timestamps: true });
export const HrmBranchModel = model<THrmBranch>("HrmBranch", branchSchema, "hrmbranches");

export type THrmDepartment = Doc<{ department_name: string; branch_id?: Types.ObjectId }>;
const deptSchema = new Schema({
  ...hrmBaseSchemaFields,
  department_name: { type: String, required: true },
  branch_id: { type: Schema.Types.ObjectId, ref: "HrmBranch" },
}, { timestamps: true });
export const HrmDepartmentModel = model<THrmDepartment>("HrmDepartment", deptSchema, "hrmdepartments");

export type THrmDesignation = Doc<{ designation_name: string; branch_id?: Types.ObjectId; department_id?: Types.ObjectId }>;
const desigSchema = new Schema({
  ...hrmBaseSchemaFields,
  designation_name: { type: String, required: true },
  branch_id: { type: Schema.Types.ObjectId, ref: "HrmBranch" },
  department_id: { type: Schema.Types.ObjectId, ref: "HrmDepartment" },
}, { timestamps: true });
export const HrmDesignationModel = model<THrmDesignation>("HrmDesignation", desigSchema, "hrmdesignations");

export type THrmShift = Doc<{
  shift_name: string;
  start_time?: string;
  end_time?: string;
  break_start_time?: string;
  break_end_time?: string;
  is_night_shift: boolean;
}>;
const shiftSchema = new Schema({
  ...hrmBaseSchemaFields,
  shift_name: { type: String, required: true },
  start_time: String,
  end_time: String,
  break_start_time: String,
  break_end_time: String,
  is_night_shift: { type: Boolean, default: false },
}, { timestamps: true });
export const HrmShiftModel = model<THrmShift>("HrmShift", shiftSchema, "hrmshifts");

export type THrmEmployeeDocumentType = Doc<{ document_name: string; description?: string; is_required: boolean }>;
export const HrmEmployeeDocumentTypeModel = model<THrmEmployeeDocumentType>(
  "HrmEmployeeDocumentType",
  new Schema({
    ...hrmBaseSchemaFields,
    document_name: { type: String, required: true },
    description: String,
    is_required: { type: Boolean, default: false },
  }, { timestamps: true }),
  "hrmemployeedocumenttypes"
);

export type THrmAwardType = Doc<{ name: string; description?: string }>;
export const HrmAwardTypeModel = model<THrmAwardType>("HrmAwardType", new Schema({ ...hrmBaseSchemaFields, name: { type: String, required: true }, description: String ,  }, { timestamps: true }), "hrmawardtypes");

export type THrmTerminationType = Doc<{ termination_type: string }>;
export const HrmTerminationTypeModel = model<THrmTerminationType>("HrmTerminationType", new Schema({ ...hrmBaseSchemaFields, termination_type: { type: String, required: true } }, { timestamps: true }), "hrmterminationtypes");

export type THrmWarningType = Doc<{ warning_type_name: string }>;
export const HrmWarningTypeModel = model<THrmWarningType>("HrmWarningType", new Schema({ ...hrmBaseSchemaFields, warning_type_name: { type: String, required: true } }, { timestamps: true }), "hrmwarningtypes");

export type THrmComplaintType = Doc<{ complaint_type: string }>;
export const HrmComplaintTypeModel = model<THrmComplaintType>("HrmComplaintType", new Schema({ ...hrmBaseSchemaFields, complaint_type: { type: String, required: true } }, { timestamps: true }), "hrmcomplainttypes");

export type THrmHolidayType = Doc<{ holiday_type: string }>;
export const HrmHolidayTypeModel = model<THrmHolidayType>("HrmHolidayType", new Schema({ ...hrmBaseSchemaFields, holiday_type: { type: String, required: true } }, { timestamps: true }), "hrmholidaytypes");

export type THrmDocumentCategory = Doc<{ document_type: string; status: boolean }>;
export const HrmDocumentCategoryModel = model<THrmDocumentCategory>("HrmDocumentCategory", new Schema({ ...hrmBaseSchemaFields, document_type: { type: String, required: true }, status: { type: Boolean, default: true } }, { timestamps: true }), "hrmdocumentcategories");

export type THrmAnnouncementCategory = Doc<{ announcement_category: string }>;
export const HrmAnnouncementCategoryModel = model<THrmAnnouncementCategory>("HrmAnnouncementCategory", new Schema({ ...hrmBaseSchemaFields, announcement_category: { type: String, required: true } }, { timestamps: true }), "hrmannouncementcategories");

export type THrmEventType = Doc<{ event_type: string }>;
export const HrmEventTypeModel = model<THrmEventType>("HrmEventType", new Schema({ ...hrmBaseSchemaFields, event_type: { type: String, required: true } }, { timestamps: true }), "hrmeventtypes");

export type THrmAllowanceType = Doc<{ name: string; description?: string }>;
export const HrmAllowanceTypeModel = model<THrmAllowanceType>("HrmAllowanceType", new Schema({ ...hrmBaseSchemaFields, name: { type: String, required: true }, description: String }, { timestamps: true }), "hrmallowancetypes");

export type THrmDeductionType = Doc<{ name: string; description?: string }>;
export const HrmDeductionTypeModel = model<THrmDeductionType>("HrmDeductionType", new Schema({ ...hrmBaseSchemaFields, name: { type: String, required: true }, description: String }, { timestamps: true }), "hrmdeductiontypes");

export type THrmLoanType = Doc<{ name: string; description?: string }>;
export const HrmLoanTypeModel = model<THrmLoanType>("HrmLoanType", new Schema({ ...hrmBaseSchemaFields, name: { type: String, required: true }, description: String }, { timestamps: true }), "hrmloantypes");

export type THrmLeaveType = Doc<{ name: string; description?: string; max_days_per_year?: number; is_paid: boolean; color: string }>;
export const HrmLeaveTypeModel = model<THrmLeaveType>("HrmLeaveType", new Schema({
  ...hrmBaseSchemaFields,
  name: { type: String, required: true },
  description: String,
  max_days_per_year: Number,
  is_paid: { type: Boolean, default: false },
  color: { type: String, default: "#FF6B6B" },
}, { timestamps: true }), "hrmleavetypes");

export type THrmIpRestrict = Doc<{ ip: string }>;
export const HrmIpRestrictModel = model<THrmIpRestrict>("HrmIpRestrict", new Schema({ ...hrmBaseSchemaFields, ip: { type: String, required: true } }, { timestamps: true }), "hrmiprestricts");

export type THrmCompanySettings = {
  user_id: Types.ObjectId;
  working_days: number[];
  ip_restrict: "on" | "off";
} & Document;

export const HrmCompanySettingsModel = model<THrmCompanySettings>(
  "HrmCompanySettings",
  new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    working_days: { type: [Number], default: [1, 2, 3, 4, 5] },
    ip_restrict: { type: String, enum: ["on", "off"], default: "off" },
  }, { timestamps: true }),
  "hrmcompanysettings"
);
