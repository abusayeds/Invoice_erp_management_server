import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { purchaseReturnService } from "./purchaseReturn.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await purchaseReturnService.createDB(req.user?._id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Purchase return created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await purchaseReturnService.getAllDB(
    req.user?._id as string,
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Purchase returns retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await purchaseReturnService.getSingleDB(req.user?._id as string, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Purchase return retrieved successfully",
    data: result,
  });
});

const approve = catchAsync(async (req: AuthRequest, res) => {
  const result = await purchaseReturnService.approveDB(req.user?._id as string, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Purchase return approved. Debit note created automatically.",
    data: result,
  });
});

const complete = catchAsync(async (req: AuthRequest, res) => {
  const result = await purchaseReturnService.completeDB(req.user?._id as string, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Purchase return completed successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await purchaseReturnService.removeDB(req.user?._id as string, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Purchase return deleted successfully",
    data: null,
  });
});

export const purchaseReturnController = { create, getAll, getSingle, approve, complete, remove };
