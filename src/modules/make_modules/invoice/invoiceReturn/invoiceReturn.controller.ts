import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { invoiceReturnService } from "./invoiceReturn.service";
import { Types } from "mongoose";
import { activitiesService } from "../../activities/activities.service";
import { ActivitiesType } from "../../activities/activities.interface";

const createReturn = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result = await invoiceReturnService.createInvoiceReturnDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Invoice Return created successfully",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Created,
    title: "Invoice Return Created",
  });
});

const getAllReturn = catchAsync(async (req: AuthRequest, res) => {
  const result = await invoiceReturnService.getAllInvoiceReturnDB(
    req.query,
    req?.user?._id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoice Returns retrieved successfully",
    data: result.allReturns,
    pagination: result.pagination,
  });
});

const getSingleReturn = catchAsync(async (req: AuthRequest, res) => {
  const result = await invoiceReturnService.getSingleInvoiceReturnDB(
    req.params.id,
    req?.user?._id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoice Return retrieved successfully",
    data: result,
  });
});

const updateReturn = catchAsync(async (req: AuthRequest, res) => {
  const result = await invoiceReturnService.updateInvoiceReturnDB(
    req.params.id,
    req?.user?._id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoice Return updated successfully",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Updated,
    title: "Invoice Return Updated",
  });
});

const deleteReturn = catchAsync(async (req: AuthRequest, res) => {
  await invoiceReturnService.deleteInvoiceReturnDB(
    req.params.id,
    req?.user?._id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoice Return deleted successfully",
    data: null,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Archived,
    title: "Invoice Return Deleted",
  });
});

export const invoiceReturnController = {
  createReturn,
  getAllReturn,
  getSingleReturn,
  updateReturn,
  deleteReturn,
};
