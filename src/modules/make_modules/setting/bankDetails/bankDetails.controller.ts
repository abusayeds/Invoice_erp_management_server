import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { bankDetailsService } from "./bankDetails.service";

const getBankDetails = catchAsync(async (req: AuthRequest, res) => {
  const result = await bankDetailsService.getDB(req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bank details retrieved successfully.",
    data: result,
  });
});

const updateBankDetails = catchAsync(async (req: AuthRequest, res) => {
  const result = await bankDetailsService.updateDB(req?.user?._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bank details saved successfully.",
    data: result,
  });
});

export const bankDetailsController = { getBankDetails, updateBankDetails };
