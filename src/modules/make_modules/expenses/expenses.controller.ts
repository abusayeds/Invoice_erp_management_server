import httpStatus from 'http-status';
import { AuthRequest } from '../../../middlewares/auth';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { expensesService } from './expenses.service';
import { Types } from 'mongoose';
import { ActivitiesType } from '../activities/activities.interface';
import { activitiesService } from '../activities/activities.service';
import { TExpenses } from './expenses.interface';

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result: TExpenses = await expensesService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expenses created successfully.',
    data: result,
  });
  await activitiesService.activitiesCreateDB({ 
    user_id: req?.user?._id as Types.ObjectId, 
    type: ActivitiesType.Created, 
    title: 'Expenses Create' 
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await expensesService.getSingleDB(id, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expenses retrieved successfully.',
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await expensesService.getAllDB(req.query, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expenses retrieved all successfully.',
    data: result.allRecords,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  req.body.user_id = req?.user?._id;
  const result = await expensesService.updateDB(id, req.user?._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expenses updated successfully.',
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Updated,
    title: 'Expenses Update',
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  await expensesService.deleteDB(id, req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expenses deleted successfully.',
    data: null,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Archived,
    title: 'Expenses Delete',
  });
});

export const expensesController = { create, getSingle, getAll, update, remove };
