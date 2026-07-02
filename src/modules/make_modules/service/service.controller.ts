import httpStatus from "http-status";
import sendResponse from "../../../utils/sendResponse";
import { ServiceService } from "./service.service";
import catchAsync from "../../../utils/catchAsync";
import { AuthRequest } from "../../../middlewares/auth";
import { ActivityAction } from "../activities/activities.interface";
import { activitiesService } from "../activities/activities.service";
import { TService } from "./service.interface";
import { ActivityModule } from "../../../utils/activityModules";
import { activityActors } from "../../../utils/activityContext";

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
    ...activityActors(req),
    module: ActivityModule.service,
    entity_ids: [result._id!],
    action: ActivityAction.created,
    title: `${result.serviceName} Service Created`,
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
    ...activityActors(req),
    module: ActivityModule.service,
    entity_ids: [result?._id ?? req.params.id],
    action: ActivityAction.updated,
    title: `${result?.serviceName ?? "Service"} Updated`,
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
    ...activityActors(req),
    module: ActivityModule.service,
    entity_ids: [result?._id ?? req.params.id],
    action: ActivityAction.archived,
    title: `${result?.serviceName ?? "Service"} Archived`,
  });
});

export const ServiceController = {
  createService,
  getAllService,
  getSingleService,
  updateService,
  deleteService,
};
