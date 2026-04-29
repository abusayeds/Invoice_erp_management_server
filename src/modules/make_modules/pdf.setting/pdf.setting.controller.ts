import httpStatus from "http-status";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { pdfSettingService } from "./pdf.setting.service";
import { ActivitiesType } from "../activities/activities.interface";
import { Types } from "mongoose";
import { activitiesService } from "../activities/activities.service";


const PdfSettingUpdate = catchAsync(async (req: AuthRequest, res) => {
  const { pdfType } = req.params;
  const result = await pdfSettingService.PdfSettingUpdateDB(pdfType, req.body, req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "PDF setting updated successfully.",
    data: result,
  });
    await activitiesService.activitiesCreateDB({
      user_id: req?.user?._id as Types.ObjectId,
      type: ActivitiesType.Created,
      title: `PDF Setting Updated`,
    });
});



export const pdfSettingController = {
  PdfSettingUpdate,
};