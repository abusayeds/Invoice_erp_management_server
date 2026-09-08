import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { emailTemplateService } from "./emailTemplate.service";

const getEmailTemplate = catchAsync(async (req: AuthRequest, res) => {
  const result = await emailTemplateService.getDB(req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Email templates retrieved successfully.",
    data: result,
  });
});

const updateEmailTemplate = catchAsync(async (req: AuthRequest, res) => {
  const { type, data } = req.body;
  const result = await emailTemplateService.updateDB(req?.user?._id as string, type, data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Email template saved successfully.",
    data: result,
  });
});

export const emailTemplateController = { getEmailTemplate, updateEmailTemplate };
