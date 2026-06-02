import { Model } from "mongoose";
import { permModule } from "../../../../utils/permissionModule";
import { AuthRequest } from "../../../../middlewares/auth";
import { createHrmCrudService } from "../shared/hrm.crud.service";
import { resolveCompanyId } from "../shared/hrm.utils";
import { validateMasterPayload, MasterResourceKey } from "./master.validation";
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

const withMasterValidation =
  (resource: MasterResourceKey) =>
  async (body: Record<string, unknown>, req: AuthRequest, partial?: boolean) => {
    await validateMasterPayload(resolveCompanyId(req), resource, body, { partial });
    return body;
  };

const master = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  resourceLabel: string,
  moduleKey: string,
  resource: MasterResourceKey,
  nameField: string,
  searchFields: string[],
  populate?: string | string[]
) =>
  createHrmCrudService({
    model,
    resourceLabel,
    permissions: {
      manage: permModule.manage(moduleKey),
      manageAny: permModule.manageAny(moduleKey),
      manageOwn: permModule.manageOwn(moduleKey),
      create: permModule.create(moduleKey),
      edit: permModule.edit(moduleKey),
      delete: permModule.delete(moduleKey),
    },
    searchFields,
    nameField,
    populate,
    beforeCreate: (body, req) => withMasterValidation(resource)(body, req),
    beforeUpdate: (body, req) => withMasterValidation(resource)(body, req, true),
  });

export const masterServices = {
  branches: master(HrmBranchModel, "Branch", "branches", "branches", "branch_name", ["branch_name"]),
  departments: master(HrmDepartmentModel, "Department", "departments", "departments", "department_name", ["department_name"], "branch_id"),
  designations: master(HrmDesignationModel, "Designation", "designations", "designations", "designation_name", ["designation_name"], ["branch_id", "department_id"]),
  shifts: master(HrmShiftModel, "Shift", "shifts", "shifts", "shift_name", ["shift_name"]),
  "employee-document-types": master(HrmEmployeeDocumentTypeModel, "Employee document type", "employee-document-types", "employee-document-types", "document_name", ["document_name"]),
  "award-types": master(HrmAwardTypeModel, "Award type", "award-types", "award-types", "name", ["name"]),
  "termination-types": master(HrmTerminationTypeModel, "Termination type", "termination-types", "termination-types", "termination_type", ["termination_type"]),
  "warning-types": master(HrmWarningTypeModel, "Warning type", "warning-types", "warning-types", "warning_type_name", ["warning_type_name"]),
  "complaint-types": master(HrmComplaintTypeModel, "Complaint type", "complaint-types", "complaint-types", "complaint_type", ["complaint_type"]),
  "holiday-types": master(HrmHolidayTypeModel, "Holiday type", "holiday-types", "holiday-types", "holiday_type", ["holiday_type"]),
  "document-categories": master(HrmDocumentCategoryModel, "Document category", "document-categories", "document-categories", "document_type", ["document_type"]),
  "announcement-categories": master(HrmAnnouncementCategoryModel, "Announcement category", "announcement-categories", "announcement-categories", "announcement_category", ["announcement_category"]),
  "event-types": master(HrmEventTypeModel, "Event type", "event-types", "event-types", "event_type", ["event_type"]),
  "allowance-types": master(HrmAllowanceTypeModel, "Allowance type", "allowance-types", "allowance-types", "name", ["name"]),
  "deduction-types": master(HrmDeductionTypeModel, "Deduction type", "deduction-types", "deduction-types", "name", ["name"]),
  "loan-types": master(HrmLoanTypeModel, "Loan type", "loan-types", "loan-types", "name", ["name"]),
  "leave-types": master(HrmLeaveTypeModel, "Leave type", "leave-types", "leave-types", "name", ["name"]),
  "ip-restricts": master(HrmIpRestrictModel, "IP restrict", "ip-restricts", "ip-restricts", "ip", ["ip"]),
};

export type { MasterResourceKey };
