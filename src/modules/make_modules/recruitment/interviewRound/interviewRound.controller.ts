import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { interviewRoundService } from "./interviewRound.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewRoundService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Interview round created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewRoundService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview rounds retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewRoundService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview round retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await interviewRoundService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview round updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await interviewRoundService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Interview round deleted successfully", data: null });
});

export const interviewRoundController = { create, getAll, getSingle, update, remove };
