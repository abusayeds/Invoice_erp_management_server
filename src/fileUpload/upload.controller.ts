import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { UPLOAD_URL_PREFIX } from "../middlewares/fileUploadNormal";

export const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No uploded file ");
  }
  const file = req.file;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File uploaded",
    data: {
      path: `${UPLOAD_URL_PREFIX}/${file.filename}`,
      url: `${req.protocol}://${req.get("host")}${UPLOAD_URL_PREFIX}/${file.filename}`,
    },
  });
});
