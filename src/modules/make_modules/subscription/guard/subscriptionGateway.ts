/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { JWT_SECRET_KEY } from "../../../../config";
import { role } from "../../../../utils/role";
import { UserModel } from "../../../basic_modules/user/user.model";
import { GATED_ROUTE_MODULES, MODULE_CATALOG } from "../subscription.constants";
import { getActiveSubscription } from "../subscription.helpers";

const labelOf = (key: string) => MODULE_CATALOG.find((m) => m.key === key)?.label ?? key;

/**
 * One global gate for every `/api/v1/:module/*` request.
 * Best-effort: it decodes the token itself (the route's own authMiddleware still runs after),
 * so it never interferes with auth. For a gated module with a valid company token:
 *   - no active subscription  -> 402 (must choose a plan)
 *   - subscription expired     -> 402
 *   - module not in the plan   -> 403
 * Superadmin always bypasses. Core (ungated) modules are never blocked here.
 */
export const subscriptionGateway = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const match = req.path.match(/^\/api\/v1\/([^/]+)/);
    if (!match) return next();

    const moduleKey = GATED_ROUTE_MODULES[match[1]];

    if (!moduleKey) return next(); // core (ungated) module
    console.log(`Subscription gateway: checking access for module ${moduleKey}...`);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next(); 
    let decoded: any;
    try {
      decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET_KEY as string);
    } catch {
      return next(); 
    }

    const user = await UserModel.findById(decoded?.user?._id);
    if (!user) return next();
    if (user.role === role.superadmin) return next();

    const companyId =
      user.role === role.company ? String(user._id) : user.companyId ? String(user.companyId) : null;
    if (!companyId) return next();

    const sub = await getActiveSubscription(companyId);
    if (!sub.exists) {
      throw new AppError(
        httpStatus.PAYMENT_REQUIRED,
        "You don't have an active subscription. Please choose a plan to use this feature."
      );
    }

    if (sub.expired) {
      throw new AppError(
        httpStatus.PAYMENT_REQUIRED,
        "Your plan has expired. Please renew your subscription."
      );
    }
    if (!sub.modules.includes(moduleKey)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `${labelOf(moduleKey)} is not included in your plan. Please upgrade.`
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};
