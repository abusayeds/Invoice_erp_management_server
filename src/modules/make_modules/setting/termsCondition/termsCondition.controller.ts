import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { termsConditionService } from "./termsCondition.service";

const getTermsCondition = catchAsync(async (req: AuthRequest, res) => {
  const result = await termsConditionService.getDB(req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms & conditions retrieved successfully.",
    data: result,
  });
});

const updateTermsCondition = catchAsync(async (req: AuthRequest, res) => {
  const result = await termsConditionService.updateDB(req?.user?._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms & conditions saved successfully.",
    data: result,
  });
});

export const termsConditionController = { getTermsCondition, updateTermsCondition };
