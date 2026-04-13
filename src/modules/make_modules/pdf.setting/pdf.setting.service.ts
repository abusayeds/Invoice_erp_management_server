import { IPDFSetting, PDFSettingModel } from "./pdf.setting.model";
import { TPDFSetting } from "./pdf.setting.interface";
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";

const PdfSettingCreateDB = async (payload: TPDFSetting): Promise<IPDFSetting> => {
   const isExist  =  await PDFSettingModel.findOne({pdfType : payload.pdfType}) 
   if(isExist) { throw new AppError(httpStatus.BAD_REQUEST , "alredy added") }
  const result = await PDFSettingModel.create(payload);
  return result;
};

const PdfSettingUpdateDB = async (
  pdfType: string,
  payload: Partial<TPDFSetting>
): Promise<IPDFSetting | null> => {
   const isExist  =  await PDFSettingModel.findOne({pdfType , user_id : payload}) 

   if(!pdfType) { throw new AppError(httpStatus.BAD_REQUEST , "pdfType is required !") }
   if(!isExist) { throw new AppError(httpStatus.BAD_REQUEST , "PDF Setting not found") }
  const result = await PDFSettingModel.findOneAndUpdate({pdfType}, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const pdfSettingService = {
  PdfSettingCreateDB,
  PdfSettingUpdateDB,
};