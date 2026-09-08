import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { hrmDashboardService } from "./hrm.dashboard.service";

const getDashboard = catchAsync(async (req: AuthRequest, res) => {
  const result = await hrmDashboardService.getDashboard(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "HRM dashboard retrieved successfully",
    data: result,
  });
});

export const hrmDashboardController = { getDashboard };
