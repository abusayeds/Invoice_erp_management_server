import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { applyCompanyUserToBody, creatorId } from "../../account/account.utils";
import { budgetService } from "./budget.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  applyCompanyUserToBody(req);
  req.body.creator_id = creatorId(req);
  const data = await budgetService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Budget created successfully",
    data,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await budgetService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budgets retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetService.updateDB(req.params.id, req.user!._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget updated successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget deleted successfully",
    data,
  });
});

const approve = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetService.approveDB(req.params.id, req.user!._id as string, req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget approved successfully",
    data,
  });
});

const active = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetService.activeDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget activated successfully",
    data,
  });
});

const close = catchAsync(async (req: AuthRequest, res) => {
  const data = await budgetService.closeDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget closed successfully",
    data,
  });
});

export const budgetController = { create, getAll, update, remove, approve, active, close };
