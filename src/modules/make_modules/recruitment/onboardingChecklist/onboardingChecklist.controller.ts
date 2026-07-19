import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { onboardingChecklistService } from "./onboardingChecklist.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await onboardingChecklistService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Onboarding checklist created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await onboardingChecklistService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Onboarding checklists retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await onboardingChecklistService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Onboarding checklist retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await onboardingChecklistService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Onboarding checklist updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await onboardingChecklistService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Onboarding checklist deleted successfully", data: null });
});

export const onboardingChecklistController = { create, getAll, getSingle, update, remove };
