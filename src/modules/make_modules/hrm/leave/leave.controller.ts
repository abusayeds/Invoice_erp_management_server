import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { leaveService } from "./leave.service";
import { masterServices } from "../master/master.registry";
import { sendHrmPaginatedList } from "../shared/hrm.response";

export const leaveController = {
  list: catchAsync(async (req: AuthRequest, res) => {
    const result = await leaveService.list(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, "Leave applications", result);
  }),
  create: catchAsync(async (req: AuthRequest, res) => {
    const data = await leaveService.create(req, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Leave requested", data });
  }),
  updateStatus: catchAsync(async (req: AuthRequest, res) => {
    const data = await leaveService.updateStatus(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Leave status updated", data });
  }),
  balance: catchAsync(async (req: AuthRequest, res) => {
    const data = await leaveService.balance(req, req.params.employeeId, req.params.leaveTypeId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Leave balance", data });
  }),
  balanceIndex: catchAsync(async (req: AuthRequest, res) => {
    const data = await leaveService.balanceReport(req, req.query as Record<string, unknown>);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Leave balance report", data });
  }),
  balanceAllEmployees: catchAsync(async (req: AuthRequest, res) => {
    const result = await leaveService.balanceAllEmployees(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, `All employees leave balance (${result.year})`, {
      data: result.data,
      pagination: result.pagination,
    });
  }),
  types: catchAsync(async (req: AuthRequest, res) => {
    const result = await masterServices["leave-types"].list(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, "Leave types", result);
  }),
  typesByEmployee: catchAsync(async (req: AuthRequest, res) => {
    const data = await leaveService.leaveTypesForEmployee(req, req.params.employeeId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Leave types for employee", data });
  }),
  update: catchAsync(async (req: AuthRequest, res) => {
    const data = await leaveService.update(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Leave application updated", data });
  }),
  remove: catchAsync(async (req: AuthRequest, res) => {
    const data = await leaveService.remove(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Leave application deleted", data });
  }),
};
