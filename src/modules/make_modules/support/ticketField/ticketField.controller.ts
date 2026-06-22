import httpStatus from "http-status";
import { Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { ticketFieldService } from "./ticketField.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message, data });
const uid = (req: AuthRequest) => req?.user?._id as string;

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  ok(res, "Ticket field created successfully.", await ticketFieldService.createDB(req.body));
});
const getAll = catchAsync(async (req: AuthRequest, res) => ok(res, "Ticket fields retrieved successfully.", await ticketFieldService.getAllDB(uid(req))));
const getSingle = catchAsync(async (req: AuthRequest, res) => ok(res, "Ticket field retrieved successfully.", await ticketFieldService.getSingleDB(req.params.id, uid(req))));
const update = catchAsync(async (req: AuthRequest, res) => ok(res, "Ticket field updated successfully.", await ticketFieldService.updateDB(req.params.id, req.body, uid(req))));
const remove = catchAsync(async (req: AuthRequest, res) => ok(res, "Ticket field deleted successfully.", await ticketFieldService.deleteDB(req.params.id, uid(req))));

export const ticketFieldController = { create, getAll, getSingle, update, remove };
