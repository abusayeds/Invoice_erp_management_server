import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { candidateOnboardingService } from "./candidateOnboarding.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await candidateOnboardingService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Candidate onboarding created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await candidateOnboardingService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Candidate onboardings retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await candidateOnboardingService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Candidate onboarding retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await candidateOnboardingService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Candidate onboarding updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await candidateOnboardingService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Candidate onboarding deleted successfully", data: null });
});

export const candidateOnboardingController = { create, getAll, getSingle, update, remove };
