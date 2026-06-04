import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { reviewCycleService } from "./reviewCycle.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await reviewCycleService.create(req, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review cycle created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await reviewCycleService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review cycles retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await reviewCycleService.single(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review cycle retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await reviewCycleService.update(req, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review cycle updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await reviewCycleService.remove(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review cycle deleted successfully",
    data: null,
  });
});

export const reviewCycleController = { create, getAll, getSingle, update, remove };
