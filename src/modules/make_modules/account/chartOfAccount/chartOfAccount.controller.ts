import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { applyCompanyUserToBody, creatorId, parseNormalBalance } from "../account.utils";
import AppError from "../../../../errors/AppError";
import { chartOfAccountService } from "./chartOfAccount.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  applyCompanyUserToBody(req);
  req.body.creator_id = creatorId(req);
  if (req.body.normal_balance !== undefined) {
    try {
      req.body.normal_balance = parseNormalBalance(req.body.normal_balance);
    } catch {
      throw new AppError(httpStatus.BAD_REQUEST, "normal_balance must be credit, debit, 0, 1, or 2");
    }
  }
  const data = await chartOfAccountService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Chart of account created successfully",
    data,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await chartOfAccountService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Chart of accounts retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const data = await chartOfAccountService.getSingleDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Chart of account retrieved successfully",
    data,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  if (req.body.normal_balance !== undefined) {
    try {
      req.body.normal_balance = parseNormalBalance(req.body.normal_balance);
    } catch {
      throw new AppError(httpStatus.BAD_REQUEST, "normal_balance must be credit, debit, 0, 1, or 2");
    }
  }
  const data = await chartOfAccountService.updateDB(req.params.id, req.user!._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Chart of account updated successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await chartOfAccountService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Chart of account deleted successfully",
    data,
  });
});

export const chartOfAccountController = { create, getAll, getSingle, update, remove };
