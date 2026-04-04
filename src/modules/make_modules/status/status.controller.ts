import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { statusService } from "./status.service";

const getStatusData = catchAsync(async (req: AuthRequest, res) => {
  const result = await statusService.getStatusDataDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Data retrieved successfully.",
    data: result,
  });
});

export const statusController =  {
  getStatusData
}