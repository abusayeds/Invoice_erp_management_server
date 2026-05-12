import httpStatus from 'http-status';
import { AuthRequest } from '../../../middlewares/auth';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { paymentReceivedService } from './paymentReceived.service';
import { Types } from 'mongoose';
import { ActivitiesType } from '../activities/activities.interface';
import { activitiesService } from '../activities/activities.service';
import { TPaymentReceived } from './paymentReceived.interface';

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result: TPaymentReceived = await paymentReceivedService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'PaymentReceived created successfully.',
    data: result,
  });
  await activitiesService.activitiesCreateDB({ 
    user_id: req?.user?._id as Types.ObjectId, 
    type: ActivitiesType.Created, 
    title: 'PaymentReceived Create' 
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await paymentReceivedService.getSingleDB(id, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'PaymentReceived retrieved successfully.',
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await paymentReceivedService.getAllDB(req.query, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'PaymentReceiveds retrieved all successfully.',
    data: result.allRecords,
    pagination: result.pagination,
  });
});

export const paymentReceivedController = { create, getSingle, getAll };
