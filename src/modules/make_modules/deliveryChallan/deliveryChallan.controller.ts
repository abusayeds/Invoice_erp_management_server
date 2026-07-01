import httpStatus from 'http-status';
import { AuthRequest } from '../../../middlewares/auth';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { deliveryChallanService } from './deliveryChallan.service';
import { Types } from 'mongoose';
import { ActivitiesType } from '../activities/activities.interface';
import { activitiesService } from '../activities/activities.service';
import { TDeliveryChallan } from './deliveryChallan.interface';

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result: TDeliveryChallan = await deliveryChallanService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'DeliveryChallan created successfully.',
    data: result,
  });
  await activitiesService.activitiesCreateDB({ 
    user_id: req?.user?._id as Types.ObjectId, 
    type: ActivitiesType.Created, 
    title: 'DeliveryChallan Create' 
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await deliveryChallanService.getSingleDB(id, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'DeliveryChallan retrieved successfully.',
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await deliveryChallanService.getAllDB(req.query, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'DeliveryChallans retrieved all successfully.',
    data: result.allRecords,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  req.body.user_id = req?.user?._id;
  const result = await deliveryChallanService.updateDB(id, req.user?._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'DeliveryChallan updated successfully.',
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Updated,
    title: 'DeliveryChallan Update',
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  await deliveryChallanService.deleteDB(id, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'DeliveryChallan deleted successfully.',
    data: null,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Archived,
    title: 'DeliveryChallan Delete',
  });
});

export const deliveryChallanController = { create, getSingle, getAll, update, remove };
