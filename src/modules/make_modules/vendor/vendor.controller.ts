import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { vendorService } from "./vendor.service";
import { ActivitiesType } from "../activities/activities.interface";
import { Types } from "mongoose";
import { activitiesService } from "../activities/activities.service";

const vendorCreate = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result = await vendorService.vendorCreateDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "vendor successfully.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({
      user_id: req?.user?._id as Types.ObjectId,
      type: ActivitiesType.Created,
      title: ` ${result?.businessProfile?.companyName || result?.name} Vendor Created`,
    });
});
const allVendor = catchAsync(async (req: AuthRequest, res) => {
  const result = await vendorService.allVendorDB( req?.user?._id as string , req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All vendor get successfully.",
    pagination : result.pagination ,
    data: result.allVendor
  });
});
const singleVendor = catchAsync(async (req: AuthRequest, res) => {
    const {id}  =  req.params
  const result = await vendorService.singleVendorDB( req?.user?._id as string , id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single vendor get successfully.",
    data: result
  });
});
const deleteVendor = catchAsync(async (req: AuthRequest, res) => {
  const result = await vendorService.deleteVendorDB( req?.user?._id as string , req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Oparation successfull.",
    data: result
  });
  await activitiesService.activitiesCreateDB({  
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Archived,
    title: ` ${result?.businessProfile?.companyName || result?.name} Vendor Archived`,
  });
});
const updateVendor = catchAsync(async (req: AuthRequest, res) => {
  const result = await vendorService.updateVendorDB( req?.user?._id as string , req.body);
 
   
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Oparation successfull.",
    data: result
  });
  await activitiesService.activitiesCreateDB({  
    user_id: req?.user?._id as Types.ObjectId,
    type: ActivitiesType.Updated,
    title: ` ${result?.businessProfile?.companyName || result?.name} Vendor Updated`,
  });
});
export const vendorController = {
  vendorCreate,
  allVendor , 
  singleVendor , 
  deleteVendor ,
  updateVendor
};
