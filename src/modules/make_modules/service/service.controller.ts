import httpStatus from "http-status";
import sendResponse from "../../../utils/sendResponse";
import { ServiceService } from "./service.service";
import catchAsync from "../../../utils/catchAsync";
import { AuthRequest } from "../../../middlewares/auth";
import { ActivitiesType } from "../activities/activities.interface";
import { activitiesService } from "../activities/activities.service";
import { Types } from "mongoose";
import { TService } from "./service.interface";

const createService = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result: TService = await ServiceService.createServiceDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Created,
    title: ` ${result?.serviceName} Service Created`,
  });
});

const getAllService = catchAsync(async (req: AuthRequest, res) => {
  const result = await ServiceService.getAllServiceDB(
    req?.user?._id as string,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services retrieved successfully",
    pagination: result.pagination,
    data: result.allService,
  });
});

const getSingleService = catchAsync(async (req: AuthRequest, res) => {
  const result = await ServiceService.getSingleServiceDB(
    req?.user?._id as string,
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service retrieved successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req: AuthRequest, res) => {
  const result = await ServiceService.updateServiceDB(
    req?.user?._id as string,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service updated successfully",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Updated,
    title: ` ${result?.serviceName} Service Updated`,
  });
});

const deleteService = catchAsync(async (req: AuthRequest, res) => {
  const result = await ServiceService.deleteServiceDB(
    req?.user?._id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Operation successful.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Archived,
    title: ` ${result?.serviceName} Service Archived`,
  });
});

export const ServiceController = {
  createService,
  getAllService,
  getSingleService,
  updateService,
  deleteService,
};
