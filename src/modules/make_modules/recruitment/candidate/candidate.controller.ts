import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { candidateService } from "./candidate.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await candidateService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Candidate created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await candidateService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Candidates retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await candidateService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Candidate retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await candidateService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Candidate updated successfully", data: result });
});

const updateStatus = catchAsync(async (req: AuthRequest, res) => {
  const result = await candidateService.updateStatus(req, req.params.id, req.body.status);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Candidate status updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await candidateService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Candidate deleted successfully", data: null });
});

export const candidateController = { create, getAll, getSingle, update, updateStatus, remove };
