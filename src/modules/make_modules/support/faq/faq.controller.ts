import httpStatus from "http-status";
import { Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { faqService } from "./faq.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message, data });
const uid = (req: AuthRequest) => req?.user?._id as string;

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  ok(res, "FAQ created successfully.", await faqService.createDB(req.body));
});
const getAll = catchAsync(async (req: AuthRequest, res) => ok(res, "FAQs retrieved successfully.", await faqService.getAllDB(uid(req))));
const getSingle = catchAsync(async (req: AuthRequest, res) => ok(res, "FAQ retrieved successfully.", await faqService.getSingleDB(req.params.id, uid(req))));
const update = catchAsync(async (req: AuthRequest, res) => ok(res, "FAQ updated successfully.", await faqService.updateDB(req.params.id, req.body, uid(req))));
const remove = catchAsync(async (req: AuthRequest, res) => ok(res, "FAQ deleted successfully.", await faqService.deleteDB(req.params.id, uid(req))));

export const faqController = { create, getAll, getSingle, update, remove };
