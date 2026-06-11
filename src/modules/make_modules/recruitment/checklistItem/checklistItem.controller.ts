import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { checklistItemService } from "./checklistItem.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await checklistItemService.create(req, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Checklist item created successfully", data: result });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await checklistItemService.list(req, req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Checklist items retrieved successfully", data: result.data, pagination: result.pagination });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await checklistItemService.single(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Checklist item retrieved successfully", data: result });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await checklistItemService.update(req, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Checklist item updated successfully", data: result });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await checklistItemService.remove(req, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Checklist item deleted successfully", data: null });
});

export const checklistItemController = { create, getAll, getSingle, update, remove };
