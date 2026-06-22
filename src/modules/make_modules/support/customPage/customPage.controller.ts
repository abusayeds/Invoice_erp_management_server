import httpStatus from "http-status";
import { Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { customPageService } from "./customPage.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message, data });
const uid = (req: AuthRequest) => req?.user?._id as string;

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  ok(res, "Custom page created successfully.", await customPageService.createDB(req.body));
});
const getAll = catchAsync(async (req: AuthRequest, res) => ok(res, "Custom pages retrieved successfully.", await customPageService.getAllDB(uid(req))));
const getSingle = catchAsync(async (req: AuthRequest, res) => ok(res, "Custom page retrieved successfully.", await customPageService.getSingleDB(req.params.id, uid(req))));
const update = catchAsync(async (req: AuthRequest, res) => ok(res, "Custom page updated successfully.", await customPageService.updateDB(req.params.id, req.body, uid(req))));
const remove = catchAsync(async (req: AuthRequest, res) => ok(res, "Custom page deleted successfully.", await customPageService.deleteDB(req.params.id, uid(req))));

export const customPageController = { create, getAll, getSingle, update, remove };
