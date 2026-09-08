import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { paymentMethodService } from "./paymentMethod.service";

const createPaymentMethod = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  const result = await paymentMethodService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment method created successfully.",
    data: result,
  });
});

const getAllPaymentMethod = catchAsync(async (req: AuthRequest, res) => {
  const result = await paymentMethodService.getAllDB(req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment methods retrieved successfully.",
    data: result,
  });
});

const getSinglePaymentMethod = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await paymentMethodService.getSingleDB(id, req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment method retrieved successfully.",
    data: result,
  });
});

const updatePaymentMethod = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await paymentMethodService.updateDB(id, req.body, req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment method updated successfully.",
    data: result,
  });
});

const deletePaymentMethod = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await paymentMethodService.deleteDB(id, req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment method deleted successfully.",
    data: result,
  });
});

export const paymentMethodController = {
  createPaymentMethod,
  getAllPaymentMethod,
  getSinglePaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
