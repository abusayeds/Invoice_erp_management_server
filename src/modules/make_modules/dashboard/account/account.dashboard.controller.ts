import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { accountDashboardService } from "./account.dashboard.service";

const getDashboard = catchAsync(async (req: AuthRequest, res) => {
  const result = await accountDashboardService.getDashboard(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account dashboard retrieved successfully",
    data: result,
  });
});

export const accountDashboardController = { getDashboard };
