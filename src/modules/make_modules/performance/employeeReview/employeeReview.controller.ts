import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { employeeReviewService } from "./employeeReview.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeReviewService.createDB(req, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Employee review created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeReviewService.getAllDB(req, req.query as Record<string, unknown>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee reviews retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeReviewService.getSingleDB(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee review retrieved successfully",
    data: result,
  });
});

const conduct = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeReviewService.conductGetDB(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Performance review form retrieved successfully",
    data: result,
  });
});

const conductStore = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeReviewService.conductStoreDB(req, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Performance review has been completed successfully",
    data: result,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await employeeReviewService.updateDB(req, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee review updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await employeeReviewService.removeDB(req, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee review deleted successfully",
    data: null,
  });
});

export const employeeReviewController = {
  create,
  getAll,
  getSingle,
  conduct,
  conductStore,
  update,
  remove,
};
