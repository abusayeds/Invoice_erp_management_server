import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { jobLocationService } from "./jobLocation.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobLocationService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Job location created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobLocationService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job locations retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobLocationService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job location retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobLocationService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job location updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await jobLocationService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job location deleted successfully", data: null });
});

export const jobLocationController = { create, getAll, getSingle, update, remove };
