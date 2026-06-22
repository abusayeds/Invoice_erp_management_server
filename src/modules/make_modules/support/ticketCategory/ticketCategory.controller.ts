import httpStatus from "http-status";
import { Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { ticketCategoryService } from "./ticketCategory.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message, data });
const uid = (req: AuthRequest) => req?.user?._id as string;

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  ok(res, "Ticket category created successfully.", await ticketCategoryService.createDB(req.body));
});
const getAll = catchAsync(async (req: AuthRequest, res) => ok(res, "Ticket categories retrieved successfully.", await ticketCategoryService.getAllDB(uid(req))));
const getSingle = catchAsync(async (req: AuthRequest, res) => ok(res, "Ticket category retrieved successfully.", await ticketCategoryService.getSingleDB(req.params.id, uid(req))));
const update = catchAsync(async (req: AuthRequest, res) => ok(res, "Ticket category updated successfully.", await ticketCategoryService.updateDB(req.params.id, req.body, uid(req))));
const remove = catchAsync(async (req: AuthRequest, res) => ok(res, "Ticket category deleted successfully.", await ticketCategoryService.deleteDB(req.params.id, uid(req))));

export const ticketCategoryController = { create, getAll, getSingle, update, remove };
