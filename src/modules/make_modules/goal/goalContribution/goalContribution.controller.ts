import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { creatorId } from "../../account/account.utils";
import { goalContributionService } from "./goalContribution.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const data = await goalContributionService.createDB(
    req.user!._id as string,
    creatorId(req),
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Goal contribution created successfully",
    data,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await goalContributionService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Goal contributions retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const update = catchAsync(async (req: AuthRequest, res) => {
  const data = await goalContributionService.updateDB(
    req.params.id,
    req.user!._id as string,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Goal contribution updated successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await goalContributionService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Goal contribution deleted successfully",
    data,
  });
});

export const goalContributionController = { create, getAll, update, remove };
