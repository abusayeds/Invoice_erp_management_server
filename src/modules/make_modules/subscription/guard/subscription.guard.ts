import httpStatus from "http-status";
import { NextFunction, Response } from "express";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { getActiveSubscription, resolveCompanyId } from "../subscription.helpers";
import { MODULE_CATALOG, UNLIMITED } from "../subscription.constants";
import { LIMIT_COUNTERS } from "./limitCounters";

// eslint-disable-next-line no-unused-vars
type AsyncMw = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;

/** Wrap an async middleware so thrown AppErrors reach the global error handler. */
const mw = (fn: AsyncMw) => (req: AuthRequest, res: Response, next: NextFunction) => {
  fn(req, res, next).catch(next);
};

const labelOf = (moduleKey: string) =>
  MODULE_CATALOG.find((m) => m.key === moduleKey)?.label ?? moduleKey;

const isExpiredError = () =>
  new AppError(httpStatus.PAYMENT_REQUIRED, "Your plan has expired. Please renew your subscription.");

const noSubError = () =>
  new AppError(
    httpStatus.PAYMENT_REQUIRED,
    "You don't have an active subscription. Please choose a plan."
  );


export const requirePlanModule = (moduleKey: string) =>
  mw(async (req, _res, next) => {
    if (req.user?.role === role.superadmin) return next();
    const companyId = resolveCompanyId(req);
    const sub = await getActiveSubscription(companyId);
    if (!sub.exists) throw noSubError();
    if (sub.expired) throw isExpiredError();
    if (!sub.modules.includes(moduleKey)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `${labelOf(moduleKey)} is not included in your plan. Please upgrade.`
      );
    }
    next();
  });

/** Block when the plan has expired (use on routes that don't need a specific module). */
export const requireActivePlan = mw(async (req, _res, next) => {
  if (req.user?.role === role.superadmin) return next();
  const companyId = resolveCompanyId(req);
  const sub = await getActiveSubscription(companyId);
  if (!sub.exists) throw noSubError();
  if (sub.expired) throw isExpiredError();
  next();
});

/**
 * Enforce a numeric resource limit before a create operation.
 * `resourceKey` "users" reads plan.number_of_users; others read plan.limits[key].
 */
export const enforcePlanLimit = (resourceKey: string) =>
  mw(async (req, _res, next) => {
    if (req.user?.role === role.superadmin) return next();
    const companyId = resolveCompanyId(req);
    const sub = await getActiveSubscription(companyId);
    if (!sub.exists) throw noSubError();
    if (sub.expired) throw isExpiredError();

    const limit = resourceKey === "users" ? sub.number_of_users : sub.limits[resourceKey];
    if (limit === undefined || limit === null || limit < 0 || limit === UNLIMITED) {
      return next(); 
    }

    const counter = LIMIT_COUNTERS[resourceKey];
    if (!counter) return next(); // no way to count → don't block

    const current = await counter(new Types.ObjectId(companyId));
    if (current >= limit) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `You have reached your plan limit for ${resourceKey} (${limit}). Please upgrade your plan.`
      );
    }
    next();
  });
