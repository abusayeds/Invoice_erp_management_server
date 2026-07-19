import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { statusService } from "./status.service";

const getStatusData = catchAsync(async (req: AuthRequest, res) => {
  const {date} = req.params;
  const result = await statusService.getStatusDataDB(req.user?._id as string , req.query , date);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Data retrieved successfully.",
    data: result,
  });
});
const graphChart = catchAsync(async (req: AuthRequest, res) => {
  const result = await statusService.graphChartDB(req.user?._id as string , req.query );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: " Graph Chart Data retrieved successfully.",
    data: result,
  });
});
const topCustomer = catchAsync(async (req: AuthRequest, res) => {
  const result = await statusService.topCustomerDB(req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: " Top Customer Data retrieved successfully.",
    data: result,
  });
});
const topProducts = catchAsync(async (req: AuthRequest, res) => {
  const result = await statusService.topProductsDB(req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: " Top Products Data retrieved successfully.",
    data: result,
  });
});

export const statusController =  {
  getStatusData,
  graphChart,
  topCustomer, 
  topProducts
}