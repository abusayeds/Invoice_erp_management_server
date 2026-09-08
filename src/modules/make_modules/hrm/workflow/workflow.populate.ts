import { PopulateOptions } from "mongoose";

/** Laravel-aligned populate for workflow GET list/single (minimal fields only). */

const userBrief: PopulateOptions = { path: "employee_id", select: "name email image" };
const userBriefBy = (path: string): PopulateOptions => ({ path, select: "name email image" });
const branchBrief = (path: string): PopulateOptions => ({ path, select: "branch_name" });
const deptBrief = (path: string): PopulateOptions => ({ path, select: "department_name branch_id" });
const desigBrief = (path: string): PopulateOptions => ({ path, select: "designation_name department_id branch_id" });

export const workflowPopulate = {
  holidays: [{ path: "holiday_type_id", select: "holiday_type" }],

  awards: [
    userBrief,
    { path: "award_type_id", select: "name" },
  ],

  promotions: [
    userBrief,
    branchBrief("previous_branch_id"),
    deptBrief("previous_department_id"),
    desigBrief("previous_designation_id"),
    branchBrief("current_branch_id"),
    deptBrief("current_department_id"),
    desigBrief("current_designation_id"),
    userBriefBy("approved_by"),
  ],

  resignations: [userBrief, userBriefBy("approved_by")],

  terminations: [
    userBrief,
    { path: "termination_type_id", select: "termination_type" },
    userBriefBy("approved_by"),
  ],

  warnings: [
    userBrief,
    userBriefBy("warning_by"),
    { path: "warning_type_id", select: "warning_type_name" },
  ],

  complaints: [
    userBrief,
    userBriefBy("against_employee_id"),
    { path: "complaint_type_id", select: "complaint_type" },
    userBriefBy("resolved_by"),
  ],

  "employee-transfers": [
    userBrief,
    branchBrief("from_branch_id"),
    deptBrief("from_department_id"),
    desigBrief("from_designation_id"),
    branchBrief("to_branch_id"),
    deptBrief("to_department_id"),
    desigBrief("to_designation_id"),
    userBriefBy("approved_by"),
  ],

  events: [
    { path: "event_type_id", select: "event_type" },
    userBriefBy("approved_by"),
    { path: "department_ids", select: "department_name branch_id" },
  ],

  announcements: [
    { path: "announcement_category_id", select: "announcement_category" },
    { path: "department_ids", select: "department_name branch_id" },
    userBriefBy("approved_by"),
  ],

  documents: [
    { path: "document_category_id", select: "document_type status" },
    userBriefBy("uploaded_by"),
    userBriefBy("approved_by"),
  ],

  acknowledgments: [
    userBrief,
    { path: "document_id", select: "title document status" },
    userBriefBy("assigned_by"),
  ],
};

export type WorkflowPopulateKey = keyof typeof workflowPopulate;
