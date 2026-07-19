import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { trainingService } from "./training.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingService.create(req, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Training created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trainings retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingService.single(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Training retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingService.update(req, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Training updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await trainingService.remove(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Training deleted successfully",
    data: null,
  });
});

export const trainingController = { create, getAll, getSingle, update, remove };
