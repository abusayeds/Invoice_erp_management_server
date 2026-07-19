import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { indicatorService } from "./indicator.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await indicatorService.create(req, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Performance indicator created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await indicatorService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Performance indicators retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await indicatorService.single(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Performance indicator retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await indicatorService.update(req, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Performance indicator updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await indicatorService.remove(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Performance indicator deleted successfully",
    data: null,
  });
});

export const indicatorController = { create, getAll, getSingle, update, remove };
