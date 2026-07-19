import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { applyCompanyUserToBody, creatorId } from "../../account/account.utils";
import { budgetPeriodService } from "./budgetPeriod.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  applyCompanyUserToBody(req);
  req.body.creator_id = creatorId(req);
  const data = await budgetPeriodService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Budget period created successfully",
    data,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await budgetPeriodService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget periods retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetPeriodService.updateDB(req.params.id, req.user!._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget period updated successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetPeriodService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget period deleted successfully",
    data,
  });
});

const approve = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetPeriodService.approveDB(req.params.id, req.user!._id as string, req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget period approved successfully",
    data,
  });
});

const active = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetPeriodService.activeDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget period activated successfully",
    data,
  });
});

const close = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetPeriodService.closeDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget period closed successfully",
    data,
  });
});

export const budgetPeriodController = { create, getAll, update, remove, approve, active, close };
