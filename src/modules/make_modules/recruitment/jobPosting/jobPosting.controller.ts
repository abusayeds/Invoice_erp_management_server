import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { jobPostingService } from "./jobPosting.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobPostingService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Job posting created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobPostingService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job postings retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobPostingService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job posting retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobPostingService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job posting updated successfully", data: result });
});

const togglePublish = catchAsync(async (req: AuthRequest, res) => {
  const result = await jobPostingService.togglePublish(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job posting publish status toggled", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await jobPostingService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job posting deleted successfully", data: null });
});

export const jobPostingController = { create, getAll, getSingle, update, togglePublish, remove };
