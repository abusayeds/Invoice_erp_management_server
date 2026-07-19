import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { employeeGoalService } from "./employeeGoal.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeGoalService.create(req, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Employee goal created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeGoalService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee goals retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeGoalService.single(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee goal retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeGoalService.update(req, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee goal updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await employeeGoalService.remove(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee goal deleted successfully",
    data: null,
  });
});

export const employeeGoalController = { create, getAll, getSingle, update, remove };
