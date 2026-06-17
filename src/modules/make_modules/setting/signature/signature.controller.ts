import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { signatureService } from "./signature.service";

const createSignature = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  const result = await signatureService.createDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Signature created successfully.",
    data: result,
  });
});

const getAllSignature = catchAsync(async (req: AuthRequest, res) => {
  const result = await signatureService.getAllDB(req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Signatures retrieved successfully.",
    data: result,
  });
});

const getSingleSignature = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await signatureService.getSingleDB(id, req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Signature retrieved successfully.",
    data: result,
  });
});

const updateSignature = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await signatureService.updateDB(id, req.body, req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Signature updated successfully.",
    data: result,
  });
});

const deleteSignature = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await signatureService.deleteDB(id, req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Signature deleted successfully.",
    data: result,
  });
});

export const signatureController = {
  createSignature,
  getAllSignature,
  getSingleSignature,
  updateSignature,
  deleteSignature,
};
