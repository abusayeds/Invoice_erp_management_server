import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { proposalService } from "./proposal.service";
import { Types } from "mongoose";
import { ActivitiesType } from "../activities/activities.interface";
import { activitiesService } from "../activities/activities.service";
import { TProposal } from "./proposal.interface";

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result: TProposal = await proposalService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Proposal created successfully.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Created,
    title: "Proposal create",
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await proposalService.getSingleDB(id, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Proposal retrieved successfully.",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await proposalService.getAllDB(req.query, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Proposals retrieved successfully.",
    data: result.allRecords,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await proposalService.updateDB(id, req.user?._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Proposal updated successfully.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Updated,
    title: "Proposal update",
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await proposalService.deleteDB(id, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Proposal deleted successfully.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Archived,
    title: "Proposal delete",
  });
});

export const proposalController = { create, getSingle, getAll, update, remove };
