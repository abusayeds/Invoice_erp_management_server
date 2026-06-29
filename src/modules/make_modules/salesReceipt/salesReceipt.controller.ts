import httpStatus from 'http-status';
import { AuthRequest } from '../../../middlewares/auth';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { salesReceiptService } from './salesReceipt.service';
import { Types } from 'mongoose';
import { ActivitiesType } from '../activities/activities.interface';
import { activitiesService } from '../activities/activities.service';
import { TSalesReceipt } from './salesReceipt.interface';

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result: TSalesReceipt = await salesReceiptService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'SalesReceipt created successfully.',
    data: result,
  });
  await activitiesService.activitiesCreateDB({ 
    user_id: req?.user?._id as Types.ObjectId, 
    type: ActivitiesType.Created, 
    title: 'SalesReceipt Create' 
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await salesReceiptService.getSingleDB(id, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'SalesReceipt retrieved successfully.',
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await salesReceiptService.getAllDB(req.query, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'SalesReceipts retrieved all successfully.',
    data: result.allRecords,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  req.body.user_id = req?.user?._id;
  const result = await salesReceiptService.updateDB(id, req.user?._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'SalesReceipt updated successfully.',
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Updated,
    title: 'SalesReceipt Update',
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  await salesReceiptService.deleteDB(id, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'SalesReceipt deleted successfully.',
    data: null,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Archived,
    title: 'SalesReceipt Delete',
  });
});

export const salesReceiptController = { create, getSingle, getAll, update, remove };
