import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { interviewService } from "./interview.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Interview scheduled successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interviews retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await interviewService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview deleted successfully", data: null });
});

export const interviewController = { create, getAll, getSingle, update, remove };
