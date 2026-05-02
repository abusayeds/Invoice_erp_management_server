import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { companyService } from "./company.service";
import { Types } from "mongoose";
import { activitiesService } from "../activities/activities.service";
import { TCompany } from "./conmapy.interface";
import { ActivitiesType } from "../activities/activities.interface";

// Create
const createCompany = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user!._id;
  const result : TCompany  = await companyService.createCompany(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Company created successfully.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({ user_id: req?.user?._id as Types.ObjectId,title: ` ${result.businessName} Company Created` , type : ActivitiesType.Created });
});

// Get All
const getAllCompanies = catchAsync(async (req: AuthRequest, res) => {
  const result = await companyService.getAllCompanies();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Companies retrieved successfully.",
    data: result,
  });
});

// Get Single
const getSingleCompany = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await companyService.getSingleCompany(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Company retrieved successfully.",
    data: result,
  });
});

// Update
const updateCompany = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result : TCompany | null = await companyService.updateCompany(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Company updated successfully.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({ user_id: req?.user?._id as Types.ObjectId, type : ActivitiesType.Updated , title: ` ${result?.businessName} Company Updated`} );
});

// Delete
const deleteCompany = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result : TCompany | null = await companyService.deleteCompany(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Company deleted successfully.",
    data: result,
  });
  await activitiesService.activitiesCreateDB({ user_id: req?.user?._id as Types.ObjectId, type : ActivitiesType.Archived , title: ` ${result?.businessName} Company Deleted` } );
});

export const companyController = {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
};
