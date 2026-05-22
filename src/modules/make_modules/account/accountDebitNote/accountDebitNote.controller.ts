import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { Types } from "mongoose";
import { accountDebitNoteService } from "./accountDebitNote.service";
import { ActivitiesType } from "../../activities/activities.interface";
import { activitiesService } from "../../activities/activities.service";
import { TDebitNote } from "../../debitNote/debitNote.interface";

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user!._id;
  const data: TDebitNote = await accountDebitNoteService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Debit note created successfully",
    data,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req.user!._id as Types.ObjectId,
    type: ActivitiesType.Created,
    title: "Debit note created",
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await accountDebitNoteService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Debit notes retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountDebitNoteService.getSingleDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Debit note retrieved successfully",
    data,
  });
});

const approve = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountDebitNoteService.approveDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Debit note approved successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await accountDebitNoteService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Debit note deleted successfully",
    data,
  });
});

export const accountDebitNoteController = { create, getAll, getSingle, approve, remove };
