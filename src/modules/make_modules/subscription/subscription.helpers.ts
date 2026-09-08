import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../errors/AppError";
import { AuthRequest } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { CompanySubscriptionModel } from "./companySubscription/companySubscription.model";
import { UNLIMITED } from "./subscription.constants";

/** The company a request belongs to: company/superadmin use own _id; sub-users use companyId. */
export const resolveCompanyId = (req: AuthRequest): string => {
  const user = req.user;
  if (!user?._id) throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
  if (user.role === role.company || user.role === role.superadmin) return String(user._id);
  if (user.companyId) return String(user.companyId);
  throw new AppError(httpStatus.BAD_REQUEST, "Company context is required");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toPlainLimits = (limits: any): Record<string, number> => {
  if (!limits) return {};
  if (limits instanceof Map) return Object.fromEntries(limits);
  return limits as Record<string, number>;
};

export type ActiveSubscription = {
  exists: boolean; // false = company has not subscribed to any plan yet
  expired: boolean;
  modules: string[];
  limits: Record<string, number>;
  number_of_users: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: any;
};

/** Load a company's active subscription snapshot in a guard-friendly shape. */
export const getActiveSubscription = async (
  companyId: string | Types.ObjectId
): Promise<ActiveSubscription> => {
  const sub = await CompanySubscriptionModel.findOne({ company_id: companyId }).lean();
  if (!sub) {
    return { exists: false, expired: false, modules: [], limits: {}, number_of_users: UNLIMITED, raw: null };
  }
  const expired =
    sub.status === "expired" ||
    sub.status === "cancelled" ||
    Boolean(sub.end_date && new Date() > new Date(sub.end_date));
  return {
    exists: true,
    expired,
    modules: sub.modules ?? [],
    limits: toPlainLimits(sub.limits),
    number_of_users: sub.number_of_users ?? UNLIMITED,
    raw: sub,
  };
};
