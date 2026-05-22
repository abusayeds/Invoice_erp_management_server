import { Model } from "mongoose";
import { createHrmCrudService } from "../shared/hrm.crud.service";
import {
  HrmAllowanceTypeModel,
  HrmAnnouncementCategoryModel,
  HrmAwardTypeModel,
  HrmBranchModel,
  HrmComplaintTypeModel,
  HrmDeductionTypeModel,
  HrmDepartmentModel,
  HrmDesignationModel,
  HrmDocumentCategoryModel,
  HrmEmployeeDocumentTypeModel,
  HrmEventTypeModel,
  HrmHolidayTypeModel,
  HrmIpRestrictModel,
  HrmLeaveTypeModel,
  HrmLoanTypeModel,
  HrmShiftModel,
  HrmTerminationTypeModel,
  HrmWarningTypeModel,
} from "../models";

const master = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  resourceLabel: string,
  moduleKey: string,
  nameField: string,
  searchFields: string[],
  populate?: string | string[]
) =>
  createHrmCrudService({
    model,
    resourceLabel,
    permissions: {
      manage: `manage-${moduleKey}`,
      manageAny: `manage-any-${moduleKey}`,
      manageOwn: `manage-own-${moduleKey}`,
      create: `create-${moduleKey}`,
      edit: `edit-${moduleKey}`,
      delete: `delete-${moduleKey}`,
    },
    searchFields,
    nameField,
    populate,
  });

export const masterServices = {
  branches: master(HrmBranchModel, "Branch", "branches", "branch_name", ["branch_name"]),
  departments: master(HrmDepartmentModel, "Department", "departments", "department_name", ["department_name"], "branch_id"),
  designations: master(HrmDesignationModel, "Designation", "designations", "designation_name", ["designation_name"], ["branch_id", "department_id"]),
  shifts: master(HrmShiftModel, "Shift", "shifts", "shift_name", ["shift_name"]),
  "employee-document-types": master(HrmEmployeeDocumentTypeModel, "Employee document type", "employee-document-types", "document_name", ["document_name"]),
  "award-types": master(HrmAwardTypeModel, "Award type", "award-types", "name", ["name"]),
  "termination-types": master(HrmTerminationTypeModel, "Termination type", "termination-types", "termination_type", ["termination_type"]),
  "warning-types": master(HrmWarningTypeModel, "Warning type", "warning-types", "warning_type_name", ["warning_type_name"]),
  "complaint-types": master(HrmComplaintTypeModel, "Complaint type", "complaint-types", "complaint_type", ["complaint_type"]),
  "holiday-types": master(HrmHolidayTypeModel, "Holiday type", "holiday-types", "holiday_type", ["holiday_type"]),
  "document-categories": master(HrmDocumentCategoryModel, "Document category", "document-categories", "document_type", ["document_type"]),
  "announcement-categories": master(HrmAnnouncementCategoryModel, "Announcement category", "announcement-categories", "announcement_category", ["announcement_category"]),
  "event-types": master(HrmEventTypeModel, "Event type", "event-types", "event_type", ["event_type"]),
  "allowance-types": master(HrmAllowanceTypeModel, "Allowance type", "allowance-types", "name", ["name"]),
  "deduction-types": master(HrmDeductionTypeModel, "Deduction type", "deduction-types", "name", ["name"]),
  "loan-types": master(HrmLoanTypeModel, "Loan type", "loan-types", "name", ["name"]),
  "leave-types": master(HrmLeaveTypeModel, "Leave type", "leave-types", "name", ["name"]),
  "ip-restricts": master(HrmIpRestrictModel, "IP restrict", "ip-restricts", "ip", ["ip"]),
};

export type MasterResourceKey = keyof typeof masterServices;
