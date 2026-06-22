import httpStatus from "http-status";
import { Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { knowledgeService } from "./knowledge.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message, data });
const uid = (req: AuthRequest) => req?.user?._id as string;

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  ok(res, "Knowledge article created successfully.", await knowledgeService.createDB(req.body));
});
const getAll = catchAsync(async (req: AuthRequest, res) => ok(res, "Knowledge articles retrieved successfully.", await knowledgeService.getAllDB(uid(req))));
const getSingle = catchAsync(async (req: AuthRequest, res) => ok(res, "Knowledge article retrieved successfully.", await knowledgeService.getSingleDB(req.params.id, uid(req))));
const update = catchAsync(async (req: AuthRequest, res) => ok(res, "Knowledge article updated successfully.", await knowledgeService.updateDB(req.params.id, req.body, uid(req))));
const remove = catchAsync(async (req: AuthRequest, res) => ok(res, "Knowledge article deleted successfully.", await knowledgeService.deleteDB(req.params.id, uid(req))));

export const knowledgeController = { create, getAll, getSingle, update, remove };
