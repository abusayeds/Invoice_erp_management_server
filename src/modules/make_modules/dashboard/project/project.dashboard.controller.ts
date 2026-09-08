import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { projectDashboardService } from "./project.dashboard.service";

const getDashboard = catchAsync(async (req: AuthRequest, res) => {
  const result = await projectDashboardService.getDashboard(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project dashboard retrieved successfully",
    data: result,
  });
});

export const projectDashboardController = { getDashboard };
