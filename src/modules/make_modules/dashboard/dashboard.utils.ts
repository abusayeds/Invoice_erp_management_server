import { Types } from "mongoose";
import { AuthRequest } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { UserModel } from "../../basic_modules/user/user.model";

// Reuse the shared company-scope / date helpers used across HRM + Recruitment.
import {
  companyObjectId,
  companyScope,
  endOfDay,
  formatDateOnly,
  resolveActorUserId,
  resolveCompanyId,
  startOfDay,
} from "../hrm/shared/hrm.utils";

export {
  companyObjectId,
  companyScope,
  endOfDay,
  formatDateOnly,
  resolveActorUserId,
  resolveCompanyId,
  startOfDay,
};

/** The logged-in user's role (Laravel `Auth::user()->type`). */
export const actorRole = (req: AuthRequest): string => String(req.user?.role ?? "");

/** Inclusive month window for a given year + 0-based month (Laravel whereMonth/whereYear). */
export const monthRange = (year: number, month0: number) => ({
  $gte: new Date(year, month0, 1, 0, 0, 0, 0),
  $lte: new Date(year, month0 + 1, 0, 23, 59, 59, 999),
});

/** Last 6 calendar months (oldest -> current), each with its short label + date window. */
export const lastSixMonths = (): { label: string; range: { $gte: Date; $lte: Date } }[] => {
  const now = new Date();
  const out: { label: string; range: { $gte: Date; $lte: Date } }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      label: d.toLocaleString("en-US", { month: "short" }),
      range: monthRange(d.getFullYear(), d.getMonth()),
    });
  }
  return out;
};

/** Count of company users with a given role (Laravel User::where created_by + type). */
export const countCompanyUsers = (companyId: string | Types.ObjectId, userRole: string) =>
  UserModel.countDocuments({
    companyId: companyObjectId(companyId),
    role: userRole,
    isDeleted: false,
  });

export const ROLE = role;
