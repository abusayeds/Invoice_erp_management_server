import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { permissionService } from "./permission.service";
import { AuthRequest } from "../../../middlewares/auth";

const updatePermission = catchAsync(async (req: AuthRequest, res: Response) => {
  const companyId = req.user?._id;
  const result = await permissionService.updatePermissionDB(companyId as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission updated successfully",
    data: result,
  });
});

const getPermissionsByCompany = catchAsync(async (req: AuthRequest, res: Response) => {
  const companyId = req.user?._id;
  const result = await permissionService.getPermissionsByCompanyDB(companyId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions fetched successfully",
    data: result,
  });
});

export const permissionController = {
  updatePermission,
  getPermissionsByCompany,
};
