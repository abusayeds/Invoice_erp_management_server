import { Schema, model, Types, Document } from "mongoose";
import { THrmBase } from "../shared/hrm.types";
import { hrmBaseSchemaFields } from "./base.schema";

type Doc<T> = T & THrmBase & Document;

export type THrmAllowance = Doc<{
  employee_id: Types.ObjectId;
  allowance_type_id: Types.ObjectId;
  type: "fixed" | "percentage";
  amount: number;
}>;
export const HrmAllowanceModel = model<THrmAllowance>("HrmAllowance", new Schema({
  ...hrmBaseSchemaFields,
  employee_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  allowance_type_id: { type: Schema.Types.ObjectId, ref: "HrmAllowanceType", required: true },
  type: { type: String, enum: ["fixed", "percentage"], required: true },
  amount: { type: Number, required: true },
}, { timestamps: true }), "hrmallowances");

export type THrmDeduction = Doc<{
  employee_id: Types.ObjectId;
  deduction_type_id: Types.ObjectId;
  type: "fixed" | "percentage";
  amount: number;
}>;
export const HrmDeductionModel = model<THrmDeduction>("HrmDeduction", new Schema({
  ...hrmBaseSchemaFields,
  employee_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  deduction_type_id: { type: Schema.Types.ObjectId, ref: "HrmDeductionType", required: true },
  type: { type: String, enum: ["fixed", "percentage"], required: true },
  amount: { type: Number, required: true },
}, { timestamps: true }), "hrmdeductions");

export type THrmLoan = Doc<{
  title: string;
  employee_id: Types.ObjectId;
  loan_type_id: Types.ObjectId;
  type: "fixed" | "percentage";
  amount: number;
  start_date: Date;
  end_date: Date;
  reason?: string;
}>;
export const HrmLoanModel = model<THrmLoan>("HrmLoan", new Schema({
  ...hrmBaseSchemaFields,
  title: { type: String, required: true },
  employee_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  loan_type_id: { type: Schema.Types.ObjectId, ref: "HrmLoanType", required: true },
  type: { type: String, enum: ["fixed", "percentage"], required: true },
  amount: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  reason: String,
}, { timestamps: true }), "hrmloans");

export type THrmOvertime = Doc<{
  title: string;
  employee_id: Types.ObjectId;
  total_days: number;
  hours: number;
  rate: number;
  start_date: Date;
  end_date: Date;
  notes?: string;
  status: "active" | "expired";
}>;
export const HrmOvertimeModel = model<THrmOvertime>("HrmOvertime", new Schema({
  ...hrmBaseSchemaFields,
  title: { type: String, required: true },
  employee_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  total_days: { type: Number, required: true },
  hours: { type: Number, required: true },
  rate: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  notes: String,
  status: { type: String, enum: ["active", "expired"], default: "active" },
}, { timestamps: true }), "hrmovertimes");

export type THrmPayroll = Doc<{
  title: string;
  payroll_frequency: "weekly" | "biweekly" | "monthly";
  pay_period_start?: Date;
  pay_period_end?: Date;
  pay_date?: Date;
  notes?: string;
  total_gross_pay?: number;
  total_deductions?: number;
  total_net_pay?: number;
  employee_count?: number;
  status: "draft" | "processing" | "completed" | "cancelled";
  is_payroll_paid: "paid" | "unpaid";
  bank_account_id?: Types.ObjectId;
}>;
export const HrmPayrollModel = model<THrmPayroll>("HrmPayroll", new Schema({
  ...hrmBaseSchemaFields,
  title: { type: String, required: true },
  payroll_frequency: { type: String, enum: ["weekly", "biweekly", "monthly"], default: "monthly" },
  pay_period_start: Date,
  pay_period_end: Date,
  pay_date: Date,
  notes: String,
  total_gross_pay: Number,
  total_deductions: Number,
  total_net_pay: Number,
  employee_count: Number,
  status: { type: String, enum: ["draft", "processing", "completed", "cancelled"], default: "draft" },
  is_payroll_paid: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  bank_account_id: { type: Schema.Types.ObjectId, ref: "AccountBankAccount" },
}, { timestamps: true }), "hrmpayrolls");

export type THrmPayrollEntry = Doc<{
  payroll_id: Types.ObjectId;
  employee_id: Types.ObjectId;
  basic_salary: number;
  total_allowances: number;
  total_deductions: number;
  total_loans: number;
  gross_pay: number;
  net_pay: number;
  per_day_salary: number;
  working_days: number;
  present_days: number;
  half_days: number;
  half_day_deduction: number;
  absent_days: number;
  absent_day_deduction: number;
  paid_leave_days: number;
  unpaid_leave_days: number;
  unpaid_leave_deduction: number;
  manual_overtime_hours: number;
  total_manual_overtimes: number;
  attendance_overtime_hours: number;
  attendance_overtime_rate: number;
  attendance_overtime_amount: number;
  overtime_hours: number;
  status: "paid" | "unpaid";
  allowances_breakdown?: Record<string, unknown>[];
  deductions_breakdown?: Record<string, unknown>[];
  manual_overtimes_breakdown?: Record<string, unknown>[];
  loans_breakdown?: Record<string, unknown>[];
}>;
export const HrmPayrollEntryModel = model<THrmPayrollEntry>(
  "HrmPayrollEntry",
  new Schema({
    ...hrmBaseSchemaFields,
    payroll_id: { type: Schema.Types.ObjectId, ref: "HrmPayroll", required: true },
    employee_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    basic_salary: { type: Number, default: 0 },
    total_allowances: { type: Number, default: 0 },
    total_deductions: { type: Number, default: 0 },
    total_loans: { type: Number, default: 0 },
    gross_pay: { type: Number, default: 0 },
    net_pay: { type: Number, default: 0 },
    per_day_salary: { type: Number, default: 0 },
    working_days: { type: Number, default: 0 },
    present_days: { type: Number, default: 0 },
    half_days: { type: Number, default: 0 },
    half_day_deduction: { type: Number, default: 0 },
    absent_days: { type: Number, default: 0 },
    absent_day_deduction: { type: Number, default: 0 },
    paid_leave_days: { type: Number, default: 0 },
    unpaid_leave_days: { type: Number, default: 0 },
    unpaid_leave_deduction: { type: Number, default: 0 },
    manual_overtime_hours: { type: Number, default: 0 },
    total_manual_overtimes: { type: Number, default: 0 },
    attendance_overtime_hours: { type: Number, default: 0 },
    attendance_overtime_rate: { type: Number, default: 0 },
    attendance_overtime_amount: { type: Number, default: 0 },
    overtime_hours: { type: Number, default: 0 },
    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    allowances_breakdown: { type: Schema.Types.Mixed },
    deductions_breakdown: { type: Schema.Types.Mixed },
    manual_overtimes_breakdown: { type: Schema.Types.Mixed },
    loans_breakdown: { type: Schema.Types.Mixed },
  }, { timestamps: true }),
  "hrmpayrollentries"
);
HrmPayrollEntryModel.schema.index({ payroll_id: 1, employee_id: 1 }, { unique: true });
