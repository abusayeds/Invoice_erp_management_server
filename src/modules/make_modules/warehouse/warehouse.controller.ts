import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { warehouseService } from "./warehouse.service";
import { Types } from "mongoose";
import { activitiesService } from "../activities/activities.service";
import { ActivitiesType } from "../activities/activities.interface";

const createWarehouse = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result = await warehouseService.createWarehouseDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Warehouse created successfully",
    data: result,
  });
  await activitiesService.activitiesCreateDB({ 
    user_id: req?.user?._id as Types.ObjectId, 
    type: ActivitiesType.Created, 
    title: "Warehouse Created" 
  });
});

const getAllWarehouse = catchAsync(async (req: AuthRequest, res) => {
  const result = await warehouseService.getAllWarehouseDB(req.query, req?.user?._id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Warehouses retrieved successfully",
    data: result.allWarehouse,
    pagination: result.pagination,
  });
});

const getSingleWarehouse = catchAsync(async (req: AuthRequest, res) => {
  const result = await warehouseService.getSingleWarehouseDB(req.params.id, req?.user?._id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Warehouse retrieved successfully",
    data: result,
  });
});

const updateWarehouse = catchAsync(async (req: AuthRequest, res) => {
  const result = await warehouseService.updateWarehouseDB(req.params.id, req?.user?._id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Warehouse updated successfully",
    data: result,
  });
  await activitiesService.activitiesCreateDB({ 
    user_id: req?.user?._id as Types.ObjectId, 
    type: ActivitiesType.Updated, 
    title: "Warehouse Updated" 
  });
});

const deleteWarehouse = catchAsync(async (req: AuthRequest, res) => {
  await warehouseService.deleteWarehouseDB(req.params.id, req?.user?._id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Warehouse deleted successfully",
    data: null,
  });
  await activitiesService.activitiesCreateDB({ 
    user_id: req?.user?._id as Types.ObjectId, 
    type: ActivitiesType.Archived, 
    title: "Warehouse Deleted" 
  });
});

export const warehouseController = {
  createWarehouse,
  getAllWarehouse,
  getSingleWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
