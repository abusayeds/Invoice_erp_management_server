import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { attendanceService } from "./attendance.service";
import { sendHrmPaginatedList } from "../shared/hrm.response";

export const attendanceController = {
  list: catchAsync(async (req: AuthRequest, res) => {
    const result = await attendanceService.list(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, "Attendances", result);
  }),
  create: catchAsync(async (req: AuthRequest, res) => {
    const data = await attendanceService.createManual(req, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Attendance created", data });
  }),
  clockStatus: catchAsync(async (req: AuthRequest, res) => {
    const data = await attendanceService.clockStatus(req);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Clock status", data });
  }),
  clockIn: catchAsync(async (req: AuthRequest, res) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip;
    const data = await attendanceService.clockIn(req, ip);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Clock in successful", data });
  }),
  clockOut: catchAsync(async (req: AuthRequest, res) => {
    const data = await attendanceService.clockOut(req);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Clock out successful", data });
  }),
  clockInOut: catchAsync(async (req: AuthRequest, res) => {
    const type = String(req.body.type).toLowerCase() === "clockout" ? "clockout" : "clockin";
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip;
    const data = await attendanceService.clockInOut(req, type, ip);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Attendance updated", data });
  }),
  history: catchAsync(async (req: AuthRequest, res) => {
    const data = await attendanceService.history(req, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Attendance history", data });
  }),
  update: catchAsync(async (req: AuthRequest, res) => {
    const data = await attendanceService.update(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Attendance updated", data });
  }),
  remove: catchAsync(async (req: AuthRequest, res) => {
    const data = await attendanceService.remove(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Attendance deleted", data });
  }),
};
