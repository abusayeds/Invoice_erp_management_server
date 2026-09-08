import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { employeeService } from "./employee.service";
import { sendHrmPaginatedList } from "../shared/hrm.response";

export const employeeController = {
  generateId: catchAsync(async (req: AuthRequest, res) => {
    const data = await employeeService.generateId(req);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Employee ID generated", data });
  }),
  list: catchAsync(async (req: AuthRequest, res) => {
    const result = await employeeService.list(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, "Employees retrieved", result);
  }),
  get: catchAsync(async (req: AuthRequest, res) => {
    const data = await employeeService.get(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Employee retrieved", data });
  }),
  create: catchAsync(async (req: AuthRequest, res) => {
    const data = await employeeService.create(req, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Employee created", data });
  }),
  update: catchAsync(async (req: AuthRequest, res) => {
    const data = await employeeService.update(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Employee updated", data });
  }),
  remove: catchAsync(async (req: AuthRequest, res) => {
    const data = await employeeService.remove(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Employee deleted", data });
  }),
  eligibleUsers: catchAsync(async (req: AuthRequest, res) => {
    const data = await employeeService.eligibleUsers(req);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Eligible users", data });
  }),
  lookups: catchAsync(async (req: AuthRequest, res) => {
    const data = await employeeService.lookups(req);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Lookups", data });
  }),
  deleteDocument: catchAsync(async (req: AuthRequest, res) => {
    const data = await employeeService.deleteDocument(req, req.params.employeeId, req.params.documentId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Document deleted", data });
  }),
};
