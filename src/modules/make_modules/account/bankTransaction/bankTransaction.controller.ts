import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { bankTransactionService } from "./bankTransaction.service";

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await bankTransactionService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bank transactions retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const markReconciled = catchAsync(async (req: AuthRequest, res) => {
  const data = await bankTransactionService.markReconciledDB(
    req.params.id,
    req.user!._id as string
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bank transaction marked as reconciled",
    data,
  });
});

export const bankTransactionController = { getAll, markReconciled };
