import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { hrmDashboardService } from "./dashboard.service";
import { workflowServices } from "../workflow/workflow.registry";
import { leaveService } from "../leave/leave.service";
import { resolveActorUserId } from "../shared/hrm.utils";
import { attendanceService } from "../attendance/attendance.service";
import { sendHrmPaginatedList } from "../shared/hrm.response";

/** Laravel mobile API parity under /hrm/mobile */
export const mobileController = {
  home: catchAsync(async (req: AuthRequest, res) => {
    const data = await hrmDashboardService.home(req);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "HRM home", data });
  }),
  events: catchAsync(async (req: AuthRequest, res) => {
    const data = await hrmDashboardService.events(req, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Events", data });
  }),
  holidaysList: catchAsync(async (req: AuthRequest, res) => {
    const result = await workflowServices.holidays.list(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, "Holidays", result);
  }),
  attendanceHistory: catchAsync(async (req: AuthRequest, res) => {
    const data = await attendanceService.history(req, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Attendance history", data });
  }),
  clockInOut: catchAsync(async (req: AuthRequest, res) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip;
    const { action, data } = await attendanceService.clockInOut(req, ip);
    const message = action === "clock_out" ? "Clock out successful" : "Clock in successful";
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message,
      data: { action, attendance: data },
    });
  }),
  getLeaves: catchAsync(async (req: AuthRequest, res) => {
    const result = await leaveService.list(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, "Leaves", result);
  }),
  leaveRequest: catchAsync(async (req: AuthRequest, res) => {
    const data = await leaveService.create(req, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Leave requested", data });
  }),
  leaveTypes: catchAsync(async (req: AuthRequest, res) => {
    const data = await leaveService.leaveTypesForEmployee(req, resolveActorUserId(req));
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Leave types with balance", data });
  }),
};

export const dashboardController = {
  home: catchAsync(async (req: AuthRequest, res) => {
    const data = await hrmDashboardService.home(req);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "HRM dashboard", data });
  }),
  eventCalendar: catchAsync(async (req: AuthRequest, res) => {
    const data = await hrmDashboardService.events(req, req.query as Record<string, unknown>);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Event calendar", data });
  }),
};
