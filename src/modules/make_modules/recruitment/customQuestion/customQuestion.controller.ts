import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { customQuestionService } from "./customQuestion.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await customQuestionService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Custom question created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await customQuestionService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Custom questions retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await customQuestionService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Custom question retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await customQuestionService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Custom question updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await customQuestionService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Custom question deleted successfully", data: null });
});

export const customQuestionController = { create, getAll, getSingle, update, remove };
