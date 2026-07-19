import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { interviewTypeService } from "./interviewType.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewTypeService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Interview type created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewTypeService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview types retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewTypeService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview type retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewTypeService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview type updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await interviewTypeService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview type deleted successfully", data: null });
});

export const interviewTypeController = { create, getAll, getSingle, update, remove };
