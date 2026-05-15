import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { returnPurchaseService } from "./returnPurchase.service";
import { Types } from "mongoose";
import { activitiesService } from "../../activities/activities.service";
import { ActivitiesType } from "../../activities/activities.interface";

const createReturn = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result = await returnPurchaseService.createReturnPurchaseDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Return purchase created successfully",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Created,
    title: "Return purchase created",
  });
});

const getAllReturn = catchAsync(async (req: AuthRequest, res) => {
  const result = await returnPurchaseService.getAllReturnPurchaseDB(
    req.query,
    req?.user?._id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Return purchases retrieved successfully",
    data: result.allReturns,
    pagination: result.pagination,
  });
});

const getSingleReturn = catchAsync(async (req: AuthRequest, res) => {
  const result = await returnPurchaseService.getSingleReturnPurchaseDB(
    req.params.id,
    req?.user?._id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Return purchase retrieved successfully",
    data: result,
  });
});

const updateReturn = catchAsync(async (req: AuthRequest, res) => {
  const result = await returnPurchaseService.updateReturnPurchaseDB(
    req.params.id,
    req?.user?._id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Return purchase updated successfully",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Updated,
    title: "Return purchase updated",
  });
});

const deleteReturn = catchAsync(async (req: AuthRequest, res) => {
  await returnPurchaseService.deleteReturnPurchaseDB(
    req.params.id,
    req?.user?._id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Return purchase deleted successfully",
    data: null,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Archived,
    title: "Return purchase deleted",
  });
});

export const returnPurchaseController = {
  createReturn,
  getAllReturn,
  getSingleReturn,
  updateReturn,
  deleteReturn,
};
