import httpStatus from "http-status";
import sendResponse from "../../../utils/sendResponse";
import { ServiceService } from "./service.service";
import catchAsync from "../../../utils/catchAsync";
import { AuthRequest } from "../../../middlewares/auth";

const createService = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;

  const result = await ServiceService.createServiceDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
});

const getAllService = catchAsync(async (req: AuthRequest, res) => {
  const result = await ServiceService.getAllServiceDB(
    req?.user?._id as string ,
     req.query
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
    req.params.id
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
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service updated successfully",
    data: result,
  });
});

const deleteService = catchAsync(async (req: AuthRequest, res) => {
  const result = await ServiceService.deleteServiceDB(
    req?.user?._id as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Operation successful.",
    data: result,
  });
});

export const ServiceController = {
  createService,
  getAllService,
  getSingleService,
  updateService,
  deleteService,
};