import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { trainingTypeService } from "./trainingType.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingTypeService.create(req, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Training type created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingTypeService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Training types retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingTypeService.single(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Training type retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingTypeService.update(req, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Training type updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await trainingTypeService.remove(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Training type deleted successfully",
    data: null,
  });
});

export const trainingTypeController = { create, getAll, getSingle, update, remove };
