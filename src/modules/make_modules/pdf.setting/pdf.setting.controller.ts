import httpStatus from "http-status";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { pdfSettingService } from "./pdf.setting.service";


const PdfSettingUpdate = catchAsync(async (req: AuthRequest, res: Response) => {
  const { pdfType } = req.params;
  const result = await pdfSettingService.PdfSettingUpdateDB(pdfType, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "PDF setting updated successfully.",
    data: result,
  });
});



export const pdfSettingController = {

  PdfSettingUpdate,
};