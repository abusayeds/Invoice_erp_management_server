import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { applyCompanyUserToBody, creatorId } from "../account.utils";
import { accountExpenseService } from "./accountExpense.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  applyCompanyUserToBody(req);
  req.body.creator_id = creatorId(req);
  const data = await accountExpenseService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Expense created successfully",
    data,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await accountExpenseService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Expenses retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountExpenseService.updateDB(
    req.params.id,
    req.user!._id as string,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Expense updated successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountExpenseService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Expense deleted successfully",
    data,
  });
});

const approve = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountExpenseService.approveDB(
    req.params.id,
    req.user!._id as string,
    req
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Expense approved successfully",
    data,
  });
});

const post = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountExpenseService.postDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Expense posted successfully",
    data,
  });
});

export const accountExpenseController = { create, getAll, update, remove, approve, post };
