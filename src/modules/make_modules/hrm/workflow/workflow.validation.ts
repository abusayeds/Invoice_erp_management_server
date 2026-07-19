import {
  HrmAnnouncementCategoryModel,
  HrmAwardTypeModel,
  HrmBranchModel,
  HrmComplaintTypeModel,
  HrmDepartmentModel,
  HrmDesignationModel,
  HrmDocumentCategoryModel,
  HrmDocumentModel,
  HrmEventTypeModel,
  HrmHolidayTypeModel,
  HrmTerminationTypeModel,
  HrmWarningTypeModel,
} from "../models";
import { validateHrmRefs, validateObjectIdArray } from "../shared/hrm.refValidation";
import { validateWorkflowRequired } from "./workflow.payload";

export type WorkflowResourceKey =
  | "holidays"
  | "awards"
  | "promotions"
  | "resignations"
  | "terminations"
  | "warnings"
  | "complaints"
  | "employee-transfers"
  | "events"
  | "announcements"
  | "documents"
  | "acknowledgments";

const branchDeptDesigRules = (prefix: string) => [
  {
    field: `${prefix}branch_id`,
    label: `${prefix ? prefix.replace(/_$/, " ") : ""}Branch`.trim(),
    model: HrmBranchModel,
    kind: "companyDoc" as const,
  },
  {
    field: `${prefix}department_id`,
    label: `${prefix ? prefix.replace(/_$/, " ") : ""}Department`.trim(),
    model: HrmDepartmentModel,
    kind: "companyDoc" as const,
  },
  {
    field: `${prefix}designation_id`,
    label: `${prefix ? prefix.replace(/_$/, " ") : ""}Designation`.trim(),
    model: HrmDesignationModel,
    kind: "companyDoc" as const,
  },
];

export const validateWorkflowPayload = async (
  companyId: string,
  resource: WorkflowResourceKey,
  body: Record<string, unknown>,
  opts?: { partial?: boolean },
) => {
  validateWorkflowRequired(resource, body, opts);

  switch (resource) {
    case "holidays":
      await validateHrmRefs(
        companyId,
        body,
        [
          {
            field: "holiday_type_id",
            label: "Holiday type",
            model: HrmHolidayTypeModel,
            kind: "companyDoc",
          },
        ],
        opts,
      );
      break;

    case "awards":
      await validateHrmRefs(
        companyId,
        body,
        [
          { field: "employee_id", label: "Employee", kind: "employeeUser", required: true },
          {
            field: "award_type_id",
            label: "Award type",
            model: HrmAwardTypeModel,
            kind: "companyDoc",
            required: true,
          },
        ],
        opts,
      );
      break;

    case "promotions":
      await validateHrmRefs(
        companyId,
        body,
        [
          { field: "employee_id", label: "Employee", kind: "employeeUser", required: true },
          ...branchDeptDesigRules("current_").map((r) => ({ ...r, required: !opts?.partial })),
          ...branchDeptDesigRules("previous_"),
        ],
        opts,
      );
      break;

    case "resignations":
      await validateHrmRefs(
        companyId,
        body,
        [{ field: "employee_id", label: "Employee", kind: "employeeUser", required: true }],
        opts,
      );
      break;

    case "terminations":
      await validateHrmRefs(
        companyId,
        body,
        [
          { field: "employee_id", label: "Employee", kind: "employeeUser", required: true },
          {
            field: "termination_type_id",
            label: "Termination type",
            model: HrmTerminationTypeModel,
            kind: "companyDoc",
            required: true,
          },
        ],
        opts,
      );
      break;

    case "warnings":
      await validateHrmRefs(
        companyId,
        body,
        [
          { field: "employee_id", label: "Employee", kind: "employeeUser", required: true },
          {
            field: "warning_type_id",
            label: "Warning type",
            model: HrmWarningTypeModel,
            kind: "companyDoc",
            required: true,
          },
          { field: "warning_by", label: "Warning by", kind: "companyUser", required: true },
        ],
        opts,
      );
      break;

    case "complaints":
      await validateHrmRefs(
        companyId,
        body,
        [
          { field: "employee_id", label: "Employee", kind: "employeeUser", required: true },
          { field: "against_employee_id", label: "Against employee", kind: "employeeUser", required: true },
          {
            field: "complaint_type_id",
            label: "Complaint type",
            model: HrmComplaintTypeModel,
            kind: "companyDoc",
            required: true,
          },
          { field: "resolved_by", label: "Resolved by", kind: "companyUser" },
        ],
        opts,
      );
      break;

    case "employee-transfers":
      await validateHrmRefs(
        companyId,
        body,
        [
          { field: "employee_id", label: "Employee", kind: "employeeUser", required: true },
          ...branchDeptDesigRules("to_").map((r) => ({ ...r, required: !opts?.partial })),
          ...branchDeptDesigRules("from_"),
          { field: "approved_by", label: "Approved by", kind: "companyUser" },
        ],
        opts,
      );
      break;

    case "events":
      await validateHrmRefs(
        companyId,
        body,
        [
          {
            field: "event_type_id",
            label: "Event type",
            model: HrmEventTypeModel,
            kind: "companyDoc",
            required: true,
          },
          { field: "approved_by", label: "Approved by", kind: "companyUser" },
        ],
        opts,
      );
      await validateObjectIdArray(
        companyId,
        body,
        "department_ids",
        HrmDepartmentModel,
        "Department",
        opts,
      );
      break;

    case "announcements":
      await validateHrmRefs(
        companyId,
        body,
        [
          {
            field: "announcement_category_id",
            label: "Announcement category",
            model: HrmAnnouncementCategoryModel,
            kind: "companyDoc",
          },
          { field: "approved_by", label: "Approved by", kind: "companyUser" },
        ],
        opts,
      );
      await validateObjectIdArray(
        companyId,
        body,
        "department_ids",
        HrmDepartmentModel,
        "Department",
        opts,
      );
      break;

    case "documents":
      await validateHrmRefs(
        companyId,
        body,
        [
          {
            field: "document_category_id",
            label: "Document category",
            model: HrmDocumentCategoryModel,
            kind: "companyDoc",
            required: true,
          },
          { field: "uploaded_by", label: "Uploaded by", kind: "companyUser" },
          { field: "approved_by", label: "Approved by", kind: "companyUser" },
        ],
        opts,
      );
      break;

    case "acknowledgments":
      await validateHrmRefs(
        companyId,
        body,
        [
          { field: "employee_id", label: "Employee", kind: "employeeUser", required: true },
          {
            field: "document_id",
            label: "HRM document",
            model: HrmDocumentModel,
            kind: "companyDoc",
            required: true,
          },
          { field: "assigned_by", label: "Assigned by", kind: "companyUser" },
        ],
        opts,
      );
      break;

    default:
      break;
  }
};
