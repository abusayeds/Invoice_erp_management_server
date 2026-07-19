import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { applyCompanyUserToBody, creatorId } from "../account.utils";
import { customerPaymentService } from "./customerPayment.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  applyCompanyUserToBody(req);
  req.body.creator_id = creatorId(req);
  const data = await customerPaymentService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Customer payment created successfully",
    data,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await customerPaymentService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer payments retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const getOutstanding = catchAsync(async (req: AuthRequest, res) => {
  const data = await customerPaymentService.getOutstandingDB(
    req.user!._id as string,
    req.params.customerId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Outstanding invoices retrieved successfully",
    data,
  });
});

const updateStatus = catchAsync(async (req: AuthRequest, res) => {
  const data = await customerPaymentService.updateStatusDB(
    req.params.id,
    req.user!._id as string,
    req.body.status
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer payment status updated successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await customerPaymentService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer payment deleted successfully",
    data,
  });
});

export const customerPaymentController = {
  create,
  getAll,
  getOutstanding,
  updateStatus,
  remove,
};
