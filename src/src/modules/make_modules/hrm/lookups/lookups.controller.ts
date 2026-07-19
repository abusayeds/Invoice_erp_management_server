import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { hrmLookupsService } from "./lookups.service";

export const hrmLookupsController = {
  warningBies: catchAsync(async (req: AuthRequest, res) => {
    const data = await hrmLookupsService.warningBies(req, req.params.employeeUserId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Warning by users", data });
  }),
  warningTypes: catchAsync(async (req: AuthRequest, res) => {
    const data = await hrmLookupsService.warningTypes(req, req.params.warningById);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Warning types", data });
  }),
  approvedBies: catchAsync(async (req: AuthRequest, res) => {
    const data = await hrmLookupsService.approvedBies(req, req.params.eventTypeId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Approved by users", data });
  }),
  shiftsByEmployee: catchAsync(async (req: AuthRequest, res) => {
    const data = await hrmLookupsService.shiftsByEmployee(req, req.params.employeeId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Employee shifts", data });
  }),
};
