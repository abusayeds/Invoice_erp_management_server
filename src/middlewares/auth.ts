import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TPermissionKey } from "../utils/permission";
import { role, TRole } from "../utils/role";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { UserModel } from "../modules/basic_modules/user/user.model";
import { IUser, TPermissions } from "../modules/basic_modules/user/user.interface";
import { permissionMiddleware } from "./permissionMiddleware";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authMiddleware = (...requiredRoles: TRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(
          new AppError(
            httpStatus.UNAUTHORIZED,
            "No token provided or invalid format."
          )
        );
      }

      const token = authHeader.split(" ")[1];

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      );

      const user: IUser | null = await UserModel.findById(decoded.user._id);
      if (!user) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, "User not found or unauthorized.")
        );
      }

      const userRole = decoded.user.role;
      if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        return next(
          new AppError(httpStatus.FORBIDDEN, "You are not authorized.")
        );
      }

      req.user = user;
      next();
    } catch (error) {

      if (error instanceof jwt.JsonWebTokenError) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, "Invalid token!")
        );
      }
      if (error instanceof jwt.TokenExpiredError) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, "Token expired!")
        );
      }

      next(error);
    }
  };
};

/** @deprecated Prefer permissionMiddleware — kept for non-HRM routes. */
export const checkPermission = (permission: TPermissionKey) => permissionMiddleware(permission);