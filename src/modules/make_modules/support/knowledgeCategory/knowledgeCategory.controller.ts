import httpStatus from "http-status";
import { Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { knowledgeCategoryService } from "./knowledgeCategory.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message, data });
const uid = (req: AuthRequest) => req?.user?._id as string;

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  ok(res, "Knowledge category created successfully.", await knowledgeCategoryService.createDB(req.body));
});
const getAll = catchAsync(async (req: AuthRequest, res) => ok(res, "Knowledge categories retrieved successfully.", await knowledgeCategoryService.getAllDB(uid(req))));
const getSingle = catchAsync(async (req: AuthRequest, res) => ok(res, "Knowledge category retrieved successfully.", await knowledgeCategoryService.getSingleDB(req.params.id, uid(req))));
const update = catchAsync(async (req: AuthRequest, res) => ok(res, "Knowledge category updated successfully.", await knowledgeCategoryService.updateDB(req.params.id, req.body, uid(req))));
const remove = catchAsync(async (req: AuthRequest, res) => ok(res, "Knowledge category deleted successfully.", await knowledgeCategoryService.deleteDB(req.params.id, uid(req))));

export const knowledgeCategoryController = { create, getAll, getSingle, update, remove };
