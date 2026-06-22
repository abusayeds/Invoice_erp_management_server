import httpStatus from "http-status";
import { Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { contactService } from "./contact.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message, data });
const uid = (req: AuthRequest) => req?.user?._id as string;

const getAll = catchAsync(async (req: AuthRequest, res) => ok(res, "Contact submissions retrieved successfully.", await contactService.getAllDB(uid(req))));
const getSingle = catchAsync(async (req: AuthRequest, res) => ok(res, "Contact submission retrieved successfully.", await contactService.getSingleDB(req.params.id, uid(req))));
const remove = catchAsync(async (req: AuthRequest, res) => ok(res, "Contact submission deleted successfully.", await contactService.deleteDB(req.params.id, uid(req))));

export const contactController = { getAll, getSingle, remove };
