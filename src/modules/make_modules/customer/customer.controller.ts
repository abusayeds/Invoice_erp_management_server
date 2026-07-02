import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { customerService } from "./customer.service";
import { activitiesService } from "../activities/activities.service";
import { ActivityAction } from "../activities/activities.interface";
import { Types } from "mongoose";
import { ActivityModule } from "../../../utils/activityModules";
import { activityActors } from "../../../utils/activityContext";

const customerCreate = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result = await customerService.customerCreateDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer successfully.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    ...activityActors(req),
    module: ActivityModule.customer,
    entity_ids: [result._id as Types.ObjectId],
    action: ActivityAction.created,
    title: `${result?.businessProfile?.companyName || result?.name} Customer Created`,
  });
});

const allCustomer = catchAsync(async (req: AuthRequest, res) => {
  const result = await customerService.allCustomerDB(
    req?.user?._id as string,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All customer get successfully.",
    pagination: result.pagination,
    data: result.allCustomer,
  });
});

const singleCustomer = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await customerService.singleCustomerDB(
    req?.user?._id as string,
    id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single customer get successfully.",
    data: result,
  });
});

const deleteCustomer = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await customerService.deleteCustomerDB(
    req?.user?._id as string,
    { _id: new Types.ObjectId(id) },
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Oparation successfull.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    ...activityActors(req),
    module: ActivityModule.customer,
    entity_ids: [id],
    action: ActivityAction.archived,
    title: `${result?.businessProfile?.companyName || result?.name || "Customer"} Archived`,
  });
});

const updateCustomer = catchAsync(async (req: AuthRequest, res) => {
  const result = await customerService.updateCustomerDB(
    req?.user?._id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Oparation successfull.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    ...activityActors(req),
    module: ActivityModule.customer,
    entity_ids: [result._id as Types.ObjectId],
    action: ActivityAction.updated,
    title: `${result?.businessProfile?.companyName || result?.name} Customer Updated`,
  });
});

export const customerController = {
  customerCreate,
  allCustomer,
  singleCustomer,
  deleteCustomer,
  updateCustomer,
};
