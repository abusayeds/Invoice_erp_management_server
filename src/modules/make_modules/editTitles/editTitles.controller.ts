import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ActivitiesType } from "../activities/activities.interface";
import { Types } from "mongoose";
import { activitiesService } from "../activities/activities.service";
import { editTitleService } from "./editTitles.service";


const editTitlesUpdate = catchAsync(async (req: AuthRequest, res) => {
  const result = await editTitleService.updateEditTitleDB(req.body , req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Updated successfully.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Updated,
    title: `Edit Title Updated`,
  });
});
const singleEditTitles= catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await editTitleService.getSingleEditTitleDB(id,);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Updated successfully.",
    data: result,
  });
});
const myEditTitles= catchAsync(async (req: AuthRequest, res) => {
  const result = await editTitleService.myEditTitleDB(req.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully.",
    data: result,
  });
});


export const editTitleController = {
  editTitlesUpdate,
  singleEditTitles , 
  myEditTitles
};