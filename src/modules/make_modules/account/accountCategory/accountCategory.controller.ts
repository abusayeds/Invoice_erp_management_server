import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { applyCompanyUserToBody, creatorId } from "../account.utils";
import { accountCategoryService } from "./accountCategory.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  applyCompanyUserToBody(req);
  req.body.creator_id = creatorId(req);
  const data = await accountCategoryService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Account category created successfully",
    data,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  if (req.query.simple === "true") {
    const data = await accountCategoryService.listActiveDB(req.user!._id as string);
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Account categories retrieved successfully",
      data,
    });
  }
  const result = await accountCategoryService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account categories retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountCategoryService.updateDB(
    req.params.id,
    req.user!._id as string,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account category updated successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountCategoryService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account category deleted successfully",
    data,
  });
});

export const accountCategoryController = { create, getAll, update, remove };
