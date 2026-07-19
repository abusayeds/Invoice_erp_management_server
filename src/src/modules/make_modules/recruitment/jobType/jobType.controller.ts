import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { jobTypeService } from "./jobType.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobTypeService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Job type created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobTypeService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job types retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobTypeService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job type retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobTypeService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job type updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await jobTypeService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job type deleted successfully", data: null });
});

export const jobTypeController = { create, getAll, getSingle, update, remove };
