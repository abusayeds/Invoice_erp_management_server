import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { applyCompanyUserToBody, creatorId, parseNormalBalance } from "../account.utils";
import { accountTypeService } from "./accountType.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  applyCompanyUserToBody(req);
  req.body.creator_id = creatorId(req);
  try {
    req.body.normal_balance = parseNormalBalance(req.body.normal_balance);
  } catch {
    throw new AppError(httpStatus.BAD_REQUEST, "normal_balance must be credit, debit, 0, 1, or 2");
  }
  const data = await accountTypeService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Account type created successfully",
    data,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await accountTypeService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account types retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
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
  const data = await accountTypeService.updateDB(req.params.id, req.user!._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account type updated successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountTypeService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account type deleted successfully",
    data,
  });
});

export const accountTypeController = { create, getAll, update, remove };
