import httpStatus from "http-status";
import { Request } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { careersService } from "./careers.service";

const jobListings = catchAsync(async (req: Request, res) => {
  const result = await careersService.jobListings(req.params.companyId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Open positions retrieved successfully", data: result });
});

const jobDetails = catchAsync(async (req: Request, res) => {
  const result = await careersService.jobDetails(req.params.companyId, req.params.jobId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job details retrieved successfully", data: result });
});

const submitApplication = catchAsync(async (req: Request, res) => {
  const result = await careersService.submitApplication(req.params.companyId, req.params.jobId, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Application submitted successfully", data: result });
});

const trackingVerify = catchAsync(async (req: Request, res) => {
  const result = await careersService.trackingVerify(req.params.companyId, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Application found", data: result });
});

const trackingDetails = catchAsync(async (req: Request, res) => {
  const result = await careersService.trackingDetails(req.params.companyId, req.params.trackingId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Application status retrieved successfully", data: result });
});

const offerResponse = catchAsync(async (req: Request, res) => {
  const result = await careersService.offerResponse(req.params.companyId, req.params.offerId, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Offer response recorded", data: result });
});

export const careersController = {
  jobListings,
  jobDetails,
  submitApplication,
  trackingVerify,
  trackingDetails,
  offerResponse,
};
