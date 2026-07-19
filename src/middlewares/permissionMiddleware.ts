import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { AuthRequest } from "./auth";
import { TPermissionKey } from "../utils/permission";
import {
  getGrantedPermissions,
  getMissingPermissions,
  hasAnyUserPermission,
} from "../utils/userPermissions";

const logPermissionDenied = (req: AuthRequest, required: TPermissionKey[]) => {
  if (process.env.NODE_ENV === "production") return;

  const user = req.user!;
  const granted = getGrantedPermissions(user, required);
  const missing = getMissingPermissions(user, required);

  console.warn("[permission denied]", {
    method: req.method,
    path: req.originalUrl,
    userId: String(user._id),
    role: user.role,
    required,
    granted: granted.length ? granted : "none",
    missing,
    hint: "User needs at least one permission from required",
    userPermissionCount: Array.isArray(user.permissions) ? user.permissions.length : 0,
  });
};

/**
 * Run after authMiddleware. User must have at least one of the given permissions.
 * Use permission.* from src/utils/permission.ts (same pattern as role.*).
 */
export const permissionMiddleware = (
  ...requiredPermissions: TPermissionKey[]
) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(httpStatus.UNAUTHORIZED, "Authentication required"));
    }
    if (requiredPermissions.length === 0) {
      return next();
    }
    if (hasAnyUserPermission(req.user, requiredPermissions)) {
      return next();
    }

    logPermissionDenied(req, requiredPermissions);
    return next(new AppError(httpStatus.FORBIDDEN, "Permission denied"));
  };
};
