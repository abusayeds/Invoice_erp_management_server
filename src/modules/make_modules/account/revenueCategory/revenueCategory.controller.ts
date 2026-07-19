import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { applyCompanyUserToBody, creatorId } from "../account.utils";
import { revenueCategoryService } from "./revenueCategory.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  applyCompanyUserToBody(req);
  req.body.creator_id = creatorId(req);
  const data = await revenueCategoryService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Revenue category created successfully",
    data,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await revenueCategoryService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Revenue categories retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const data = await revenueCategoryService.updateDB(
    req.params.id,
    req.user!._id as string,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Revenue category updated successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await revenueCategoryService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Revenue category deleted successfully",
    data,
  });
});

export const revenueCategoryController = { create, getAll, update, remove };
