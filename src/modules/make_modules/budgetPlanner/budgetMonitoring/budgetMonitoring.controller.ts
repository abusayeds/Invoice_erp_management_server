import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { budgetMonitoringService } from "./budgetMonitoring.service";

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await budgetMonitoringService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Budget monitoring records retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

export const budgetMonitoringController = { getAll };
