import {  Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { TeamMemberModel } from "../modules/make_modules/teamMember/teamMember.model";
import { TModuleName, TAccessLevel } from "../modules/make_modules/teamMember/teamMember.interface";
import { AuthRequest } from "./auth";
import { InvoiceManagementType } from "../modules/make_modules/invoiceManagement/invoice.management.interface";


export const checkPermission = (moduleName: TModuleName | "DYNAMIC", requiredAccessLevels: TAccessLevel[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AppError(httpStatus.UNAUTHORIZED, "You are not logged in."));
      }
      const user_id = req.user._id;
      const teamMember = await TeamMemberModel.findOne({ user_id, status: "accepted" });
      if (!teamMember) {
         throw new AppError(httpStatus.FORBIDDEN, "TeamMember not found.");
      }

      const allowedTypes = Object.values(InvoiceManagementType);
        if (!req.body.type) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Invoice type is required. Allowed types: ${allowedTypes.join(", ")}`,
          );
        }
        if (!allowedTypes.includes(req.body.type)) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Invalid invoice type. Allowed types: ${allowedTypes.join(", ")}`,
          );
        }
      // Determine the actual module name dynamically if requested
      const actualModuleName = moduleName === "DYNAMIC" 
        ? (req.body.type || req.query.type) 
        : moduleName;

      if (!actualModuleName) {
        return next(new AppError(httpStatus.BAD_REQUEST, "Module type is required for permission check."));
      }

      const modulePermission = teamMember.permissions.find((p : any)=> p.module === actualModuleName);

      if (!modulePermission || !requiredAccessLevels.includes(modulePermission.access)) {
        return next(
          new AppError(
            httpStatus.FORBIDDEN,
            `You do not have ${requiredAccessLevels.join(" or ")} permission for ${actualModuleName}`
          )
        );
      }
      (req as any).teamMember = teamMember;
      (req as any).modulePermission = modulePermission;

      next();
    } catch (error) {
      next(error);
    }
  };
};
