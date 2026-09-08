import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { MODULE_CATALOG, LIMIT_RESOURCES } from "../subscription.constants";
import { planService } from "./plan.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await planService.createPlanDB(req.body, req.user?._id as string);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Plan created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await planService.getAllPlansDB(req.query as Record<string, unknown>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plans retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await planService.getSinglePlanDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const result = await planService.updatePlanDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  await planService.deletePlanDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan deleted successfully",
    data: null,
  });
});

/** Catalog the admin plan builder picks from (modules + limit resources). */
const catalog = catchAsync(async (_req: AuthRequest, res) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan catalog retrieved successfully",
    data: { modules: MODULE_CATALOG, limit_resources: LIMIT_RESOURCES },
  });
});

export const planController = { create, getAll, getSingle, update, remove, catalog };
