import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { recruitmentDashboardService } from "./dashboard.service";

const getDashboard = catchAsync(async (req: AuthRequest, res) => {
  const result = await recruitmentDashboardService.getDashboard(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recruitment dashboard retrieved successfully",
    data: result,
  });
});

export const recruitmentDashboardController = { getDashboard };
