import { Model } from "mongoose";
import { permModule } from "../../../../utils/permissionModule";
import { AuthRequest } from "../../../../middlewares/auth";
import { createHrmCrudService } from "../shared/hrm.crud.service";
import { endOfDay, parseDate, resolveCompanyId, startOfDay } from "../shared/hrm.utils";
import {
  applyWorkflowCreateHooks,
  applyWorkflowUpdateHooks,
} from "./workflow.hooks";
import { normalizeWorkflowPayload } from "./workflow.payload";
import { validateWorkflowPayload, WorkflowResourceKey } from "./workflow.validation";
import { workflowPopulate } from "./workflow.populate";
import { applyWorkflowStatusOnWrite } from "../shared/hrm.statusValidation";
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

const prepareWorkflowBody =
  (resource: WorkflowResourceKey, mode: "create" | "update") =>
  async (body: Record<string, unknown>, req: AuthRequest) => {
    const companyId = resolveCompanyId(req);
    const partial = mode === "update";
    normalizeWorkflowPayload(resource, body);
    applyWorkflowStatusOnWrite(resource, body);
    await validateWorkflowPayload(companyId, resource, body, { partial });
    if (mode === "create") await applyWorkflowCreateHooks(companyId, resource, body);
    else await applyWorkflowUpdateHooks(companyId, resource, body);
    return body;
  };

const wf = (
  model: Model<any>,
  label: string,
  moduleKey: string,
  resource: WorkflowResourceKey,
  search: string[],
  populate?: import("mongoose").PopulateOptions | import("mongoose").PopulateOptions[]
) =>
  createHrmCrudService({
    model,
    resourceLabel: label,
    permissions: {
      manage: permModule.manage(moduleKey),
      manageAny: permModule.manageAny(moduleKey),
      manageOwn: permModule.manageOwn(moduleKey),
      create: permModule.create(moduleKey),
      edit: permModule.edit(moduleKey),
      delete: permModule.delete(moduleKey),
    },
    searchFields: search,
    populate,
    beforeCreate: (body, req) => prepareWorkflowBody(resource, "create")(body, req),
    beforeUpdate: (body, req) => prepareWorkflowBody(resource, "update")(body, req),
  });

const normalizeHolidayDateRange = (body: Record<string, unknown>) => {
  if (body.start_date != null) {
    body.start_date = startOfDay(parseDate(body.start_date, "start_date"));
  }
  if (body.end_date != null) {
    body.end_date = endOfDay(parseDate(body.end_date, "end_date"));
  }
  return body;
};

export const workflowServices = {
  holidays: createHrmCrudService({
    model: HrmHolidayModel,
    resourceLabel: "Holiday",
    permissions: {
      manage: permModule.manage("holidays"),
      manageAny: permModule.manageAny("holidays"),
      manageOwn: permModule.manageOwn("holidays"),
      create: permModule.create("holidays"),
      edit: permModule.edit("holidays"),
      delete: permModule.delete("holidays"),
    },
    searchFields: ["name"],
    populate: workflowPopulate.holidays,
    beforeCreate: async (body, req) => {
      const normalized = normalizeHolidayDateRange(body);
      return prepareWorkflowBody("holidays", "create")(normalized, req);
    },
    beforeUpdate: async (body, req) => {
      const normalized = normalizeHolidayDateRange(body);
      return prepareWorkflowBody("holidays", "update")(normalized, req);
    },
  }),
  awards: wf(HrmAwardModel, "Award", "awards", "awards", ["description", "certificate"], workflowPopulate.awards),
  promotions: wf(HrmPromotionModel, "Promotion", "promotions", "promotions", ["reason"], workflowPopulate.promotions),
  resignations: wf(HrmResignationModel, "Resignation", "resignations", "resignations", ["reason"], workflowPopulate.resignations),
  terminations: wf(HrmTerminationModel, "Termination", "terminations", "terminations", ["reason"], workflowPopulate.terminations),
  warnings: wf(HrmWarningModel, "Warning", "warnings", "warnings", ["subject", "description"], workflowPopulate.warnings),
  complaints: wf(HrmComplaintModel, "Complaint", "complaints", "complaints", ["subject", "description"], workflowPopulate.complaints),
  "employee-transfers": wf(HrmEmployeeTransferModel, "Transfer", "employee-transfers", "employee-transfers", ["reason"], workflowPopulate["employee-transfers"]),
  events: wf(HrmEventModel, "Event", "events", "events", ["title", "description"], workflowPopulate.events),
  announcements: wf(HrmAnnouncementModel, "Announcement", "announcements", "announcements", ["title", "description"], workflowPopulate.announcements),
  documents: wf(HrmDocumentModel, "HRM Document", "hrm-documents", "documents", ["title"], workflowPopulate.documents),
  acknowledgments: wf(HrmAcknowledgmentModel, "Acknowledgment", "acknowledgments", "acknowledgments", ["acknowledgment_note"], workflowPopulate.acknowledgments),
};

export type { WorkflowResourceKey };
