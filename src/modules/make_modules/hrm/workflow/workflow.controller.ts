import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { workflowServices, WorkflowResourceKey } from "./workflow.registry";
import { assertPermission, companyScope, creatorObjectId, resolveCompanyId } from "../shared/hrm.utils";
import { sendHrmPaginatedList } from "../shared/hrm.response";
import {
  HrmWarningModel,
  HrmEventModel,
  HrmAnnouncementModel,
  HrmComplaintModel,
  HrmPromotionModel,
  HrmResignationModel,
  HrmTerminationModel,
  HrmEmployeeTransferModel,
  HrmDocumentModel,
  HrmAcknowledgmentModel,
} from "../models";

const getSvc = (resource: string) => {
  const s = workflowServices[resource as WorkflowResourceKey];
  if (!s) throw new AppError(httpStatus.NOT_FOUND, `Unknown workflow resource: ${resource}`);
  return s;
};

const statusModels: Record<string, typeof HrmWarningModel> = {
  promotions: HrmPromotionModel as never,
  resignations: HrmResignationModel as never,
  terminations: HrmTerminationModel as never,
  complaints: HrmComplaintModel as never,
  "employee-transfers": HrmEmployeeTransferModel as never,
  events: HrmEventModel as never,
  announcements: HrmAnnouncementModel as never,
  documents: HrmDocumentModel as never,
  acknowledgments: HrmAcknowledgmentModel as never,
  warnings: HrmWarningModel as never,
};

export const workflowController = {
  list: (r: string) =>
    catchAsync(async (req: AuthRequest, res) => {
      const result = await getSvc(r).list(req, req.query as Record<string, unknown>);
      sendHrmPaginatedList(res, "List retrieved", result);
    }),
  get: (r: string) =>
    catchAsync(async (req: AuthRequest, res) => {
      const data = await getSvc(r).get(req, req.params.id);
      sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Detail", data });
    }),
  create: (r: string) =>
    catchAsync(async (req: AuthRequest, res) => {
      const data = await getSvc(r).create(req, req.body);
      sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Created", data });
    }),
  update: (r: string) =>
    catchAsync(async (req: AuthRequest, res) => {
      const data = await getSvc(r).update(req, req.params.id, req.body);
      sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Updated", data });
    }),
  remove: (r: string) =>
    catchAsync(async (req: AuthRequest, res) => {
      const data = await getSvc(r).remove(req, req.params.id);
      sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Deleted", data });
    }),
  updateStatus: (r: string, perm: string) =>
    catchAsync(async (req: AuthRequest, res) => {
      assertPermission(req, perm);
      const Model = statusModels[r];
      if (!Model) throw new AppError(httpStatus.BAD_REQUEST, "Status update not supported");
      const companyId = resolveCompanyId(req);
      const updated = await Model.findOneAndUpdate(
        { _id: req.params.id, ...companyScope(companyId) },
        { $set: { status: req.body.status, approved_by: creatorObjectId(req), ...(req.body.employee_response ? { employee_response: req.body.employee_response } : {}) } },
        { new: true }
      ).lean();
      if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Record not found");
      sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Status updated", data: updated });
    }),
  eventCalendar: catchAsync(async (req: AuthRequest, res) => {
    assertPermission(req, "manage-events");
    const companyId = resolveCompanyId(req);
    const events = await HrmEventModel.find({ ...companyScope(companyId), status: "approved" })
      .populate("event_type_id", "event_type")
      .lean();
    const data = events.map((e) => ({
      _id: String(e._id),
      title: e.title,
      startDate: e.start_date,
      endDate: e.end_date,
      time: e.start_time,
      description: e.description ?? "",
      type: (e.event_type_id as { event_type?: string } | null)?.event_type ?? "event",
      color: e.color ?? "#3b82f6",
    }));
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Event calendar", data });
  }),
  resignationStatusPath: catchAsync(async (req: AuthRequest, res) => {
    assertPermission(req, "manage-resignation-status");
    const companyId = resolveCompanyId(req);
    const status = req.params.status;
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid status");
    }
    const updated = await HrmResignationModel.findOneAndUpdate(
      { _id: req.params.id, ...companyScope(companyId) },
      { $set: { status, approved_by: creatorObjectId(req) } },
      { new: true }
    ).lean();
    if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Resignation not found");
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Resignation status updated", data: updated });
  }),
  warningResponse: catchAsync(async (req: AuthRequest, res) => {
    assertPermission(req, "manage-warning-response");
    const companyId = resolveCompanyId(req);
    const updated = await HrmWarningModel.findOneAndUpdate(
      { _id: req.params.id, ...companyScope(companyId) },
      { $set: { employee_response: req.body.employee_response } },
      { new: true }
    ).lean();
    if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Warning not found");
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Response saved", data: updated });
  }),
};
