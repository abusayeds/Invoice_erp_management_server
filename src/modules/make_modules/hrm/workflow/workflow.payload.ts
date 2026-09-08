import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import { parseDate, parseOptionalDate } from "../shared/hrm.utils";
import type { WorkflowResourceKey } from "./workflow.validation";

const hasValue = (v: unknown) => v !== undefined && v !== null && v !== "";

export const requireFields = (
  body: Record<string, unknown>,
  fields: { key: string; label: string }[],
  opts?: { partial?: boolean },
) => {
  for (const { key, label } of fields) {
    if (opts?.partial && !hasValue(body[key]) && body[key] !== "") continue;
    if (!hasValue(body[key])) {
      throw new AppError(httpStatus.BAD_REQUEST, `${label} is required`);
    }
  }
};

const alias = (body: Record<string, unknown>, from: string, to: string) => {
  if (!hasValue(body[to]) && hasValue(body[from])) body[to] = body[from];
};

/** Map legacy / UI field names to Laravel-aligned schema before validation. */
export const normalizeWorkflowPayload = (resource: WorkflowResourceKey, body: Record<string, unknown>) => {
  switch (resource) {
    case "awards":
      alias(body, "date", "award_date");
      alias(body, "gift", "certificate");
      if (hasValue(body.award_date)) body.award_date = parseDate(body.award_date, "award_date");
      break;

    case "promotions":
      if (hasValue(body.effective_date)) body.effective_date = parseDate(body.effective_date, "effective_date");
      break;

    case "resignations":
      alias(body, "resignation_date", "last_working_date");
      alias(body, "notice_date", "last_working_date");
      if (hasValue(body.last_working_date)) {
        body.last_working_date = parseDate(body.last_working_date, "last_working_date");
      }
      break;

    case "terminations":
      if (hasValue(body.notice_date)) body.notice_date = parseDate(body.notice_date, "notice_date");
      if (hasValue(body.termination_date)) {
        body.termination_date = parseDate(body.termination_date, "termination_date");
      }
      break;

    case "warnings":
      if (hasValue(body.warning_date)) body.warning_date = parseDate(body.warning_date, "warning_date");
      break;

    case "complaints":
      if (hasValue(body.complaint_date)) body.complaint_date = parseDate(body.complaint_date, "complaint_date");
      break;

    case "employee-transfers":
      if (hasValue(body.effective_date)) body.effective_date = parseDate(body.effective_date, "effective_date");
      if (hasValue(body.transfer_date)) body.transfer_date = parseDate(body.transfer_date, "transfer_date");
      break;

    case "events": {
      if (Array.isArray(body.departments) && !hasValue(body.department_ids)) {
        body.department_ids = body.departments;
      }
      if (hasValue(body.start_date)) body.start_date = parseDate(body.start_date, "start_date");
      if (hasValue(body.end_date)) body.end_date = parseDate(body.end_date, "end_date");
      break;
    }

    case "announcements":
      if (hasValue(body.start_date)) body.start_date = parseOptionalDate(body.start_date);
      if (hasValue(body.end_date)) body.end_date = parseOptionalDate(body.end_date);
      if (Array.isArray(body.departments) && !hasValue(body.department_ids)) {
        body.department_ids = body.departments;
      }
      break;

    case "documents":
      if (hasValue(body.effective_date)) body.effective_date = parseOptionalDate(body.effective_date);
      break;

    default:
      break;
  }
  return body;
};

export const validateWorkflowRequired = (
  resource: WorkflowResourceKey,
  body: Record<string, unknown>,
  opts?: { partial?: boolean },
) => {
  switch (resource) {
    case "awards":
      requireFields(
        body,
        [
          { key: "employee_id", label: "Employee" },
          { key: "award_type_id", label: "Award type" },
          { key: "award_date", label: "Award date" },
        ],
        opts,
      );
      break;

    case "promotions":
      requireFields(
        body,
        [
          { key: "employee_id", label: "Employee" },
          { key: "current_branch_id", label: "Current branch" },
          { key: "current_department_id", label: "Current department" },
          { key: "current_designation_id", label: "Current designation" },
          { key: "effective_date", label: "Effective date" },
        ],
        opts,
      );
      break;

    case "resignations":
      requireFields(
        body,
        [
          { key: "employee_id", label: "Employee" },
          { key: "last_working_date", label: "Last working date" },
          { key: "reason", label: "Reason" },
        ],
        opts,
      );
      break;

    case "terminations":
      requireFields(
        body,
        [
          { key: "employee_id", label: "Employee" },
          { key: "termination_type_id", label: "Termination type" },
          { key: "notice_date", label: "Notice date" },
          { key: "termination_date", label: "Termination date" },
          { key: "reason", label: "Reason" },
        ],
        opts,
      );
      if (!opts?.partial && hasValue(body.notice_date) && hasValue(body.termination_date)) {
        const notice = body.notice_date as Date;
        const term = body.termination_date as Date;
        if (term < notice) {
          throw new AppError(httpStatus.BAD_REQUEST, "Termination date must be on or after notice date");
        }
      }
      break;

    case "warnings":
      requireFields(
        body,
        [
          { key: "employee_id", label: "Employee" },
          { key: "warning_by", label: "Warning by" },
          { key: "warning_type_id", label: "Warning type" },
          { key: "subject", label: "Subject" },
          { key: "severity", label: "Severity" },
          { key: "warning_date", label: "Warning date" },
        ],
        opts,
      );
      break;

    case "complaints":
      requireFields(
        body,
        [
          { key: "employee_id", label: "Employee" },
          { key: "against_employee_id", label: "Against employee" },
          { key: "complaint_type_id", label: "Complaint type" },
          { key: "subject", label: "Subject" },
          { key: "description", label: "Description" },
          { key: "complaint_date", label: "Complaint date" },
        ],
        opts,
      );
      if (
        !opts?.partial &&
        hasValue(body.employee_id) &&
        hasValue(body.against_employee_id) &&
        String(body.employee_id) === String(body.against_employee_id)
      ) {
        throw new AppError(httpStatus.BAD_REQUEST, "Employee and against employee must be different");
      }
      break;

    case "employee-transfers":
      requireFields(
        body,
        [
          { key: "employee_id", label: "Employee" },
          { key: "to_branch_id", label: "To branch" },
          { key: "to_department_id", label: "To department" },
          { key: "to_designation_id", label: "To designation" },
          { key: "effective_date", label: "Effective date" },
          { key: "reason", label: "Reason" },
        ],
        opts,
      );
      break;

    case "events":
      requireFields(
        body,
        [
          { key: "title", label: "Title" },
          { key: "event_type_id", label: "Event type" },
          { key: "start_date", label: "Start date" },
          { key: "end_date", label: "End date" },
          { key: "start_time", label: "Start time" },
          { key: "end_time", label: "End time" },
          { key: "location", label: "Location" },
        ],
        opts,
      );
      if (!opts?.partial) {
        const deptIds = body.department_ids ?? body.departments;
        if (!Array.isArray(deptIds) || deptIds.length === 0) {
          throw new AppError(httpStatus.BAD_REQUEST, "At least one department is required");
        }
        if (hasValue(body.start_date) && hasValue(body.end_date) && (body.end_date as Date) < (body.start_date as Date)) {
          throw new AppError(httpStatus.BAD_REQUEST, "End date must be on or after start date");
        }
      }
      break;

    case "documents":
      requireFields(
        body,
        [
          { key: "title", label: "Title" },
          { key: "document_category_id", label: "Document category" },
          { key: "document", label: "Document file" },
        ],
        opts,
      );
      break;

    case "acknowledgments":
      requireFields(
        body,
        [
          { key: "employee_id", label: "Employee" },
          { key: "document_id", label: "Document" },
        ],
        opts,
      );
      break;

    default:
      break;
  }
};
