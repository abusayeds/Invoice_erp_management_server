import { Model } from "mongoose";
import { createHrmCrudService } from "../shared/hrm.crud.service";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import {
  HrmAcknowledgmentModel,
  HrmAnnouncementModel,
  HrmAwardModel,
  HrmComplaintModel,
  HrmDocumentModel,
  HrmEmployeeTransferModel,
  HrmEventModel,
  HrmHolidayModel,
  HrmPromotionModel,
  HrmResignationModel,
  HrmTerminationModel,
  HrmWarningModel,
} from "../models";

const wf = (
  model: Model<any>,
  label: string,
  moduleKey: string,
  search: string[],
  populate?: string | string[]
) =>
  createHrmCrudService({
    model,
    resourceLabel: label,
    permissions: {
      manage: `manage-${moduleKey}`,
      manageAny: `manage-any-${moduleKey}`,
      manageOwn: `manage-own-${moduleKey}`,
      create: `create-${moduleKey}`,
      edit: `edit-${moduleKey}`,
      delete: `delete-${moduleKey}`,
    },
    searchFields: search,
    populate,
  });

export const workflowServices = {
  holidays: wf(HrmHolidayModel, "Holiday", "holidays", ["name"], "holiday_type_id"),
  awards: wf(HrmAwardModel, "Award", "awards", ["description", "gift"], ["employee_id", "award_type_id"]),
  promotions: wf(HrmPromotionModel, "Promotion", "promotions", ["reason"], "employee_id"),
  resignations: wf(HrmResignationModel, "Resignation", "resignations", ["reason"], "employee_id"),
  terminations: wf(HrmTerminationModel, "Termination", "terminations", ["reason"], ["employee_id", "termination_type_id"]),
  warnings: wf(HrmWarningModel, "Warning", "warnings", ["subject", "description"], ["employee_id", "warning_type_id"]),
  complaints: wf(HrmComplaintModel, "Complaint", "complaints", ["subject", "description"], ["employee_id", "complaint_type_id"]),
  "employee-transfers": wf(HrmEmployeeTransferModel, "Transfer", "employee-transfers", ["reason"], "employee_id"),
  events: wf(HrmEventModel, "Event", "events", ["title", "description"], ["event_type_id", "approved_by"]),
  announcements: wf(HrmAnnouncementModel, "Announcement", "announcements", ["title", "description"], "announcement_category_id"),
  documents: wf(HrmDocumentModel, "HRM Document", "hrm-documents", ["title"], ["document_category_id", "uploaded_by"]),
  acknowledgments: wf(HrmAcknowledgmentModel, "Acknowledgment", "acknowledgments", ["acknowledgment_note"], ["employee_id", "document_id"]),
};

export type WorkflowResourceKey = keyof typeof workflowServices;
