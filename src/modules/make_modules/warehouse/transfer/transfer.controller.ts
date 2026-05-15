import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { transferService } from "./transfer.service";
import { Types } from "mongoose";
import { activitiesService } from "../../activities/activities.service";
import { ActivitiesType } from "../../activities/activities.interface";

const createTransfer = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result = await transferService.createTransferDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Stock transfer completed successfully",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Created,
    title: "Warehouse stock transfer",
  });
});

const getAllTransfer = catchAsync(async (req: AuthRequest, res) => {
  const result = await transferService.getAllTransferDB(req.query, req?.user?._id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stock transfers retrieved successfully",
    data: result.allTransfers,
    pagination: result.pagination,
  });
});

const getSingleTransfer = catchAsync(async (req: AuthRequest, res) => {
  const result = await transferService.getSingleTransferDB(
    req.params.id,
    req?.user?._id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stock transfer retrieved successfully",
    data: result,
  });
});

export const transferController = {
  createTransfer,
  getAllTransfer,
  getSingleTransfer,
};
