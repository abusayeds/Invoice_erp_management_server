import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { posService } from "./pos.service";

const getDashboard = catchAsync(async (req: AuthRequest, res) => {
  const result = await posService.getDashboard(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "POS dashboard retrieved successfully",
    data: result,
  });
});

export const posController = { getDashboard };
