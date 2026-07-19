import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { dashboardService } from "./dashboard.service";

const index = catchAsync(async (req: AuthRequest, res) => {
  const data = await dashboardService.getCompanyDashboardDB(req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account dashboard retrieved successfully",
    data,
  });
});

export const dashboardController = { index };
