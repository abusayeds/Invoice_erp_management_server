import httpStatus from "http-status";
import { FilterQuery, Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { role, TRole } from "../../../../utils/role";
import { IUser } from "../../../basic_modules/user/user.interface";
import { TPermissionKey } from "../../../../utils/permission";
import { hasUserPermission } from "../../../../utils/userPermissions";

export const companyObjectId = (id: string | Types.ObjectId) =>
  id instanceof Types.ObjectId ? id : new Types.ObjectId(String(id));
export const resolveCompanyId = (req: AuthRequest): string => {
  const user = req.user;
  if (!user?._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
  }
  if (user.role === role.company || user.role === role.superadmin) {
    return String(user._id);
  }
  if (user.companyId) {
    return String(user.companyId);
  }
  throw new AppError(httpStatus.BAD_REQUEST, "Company context is required for this action");
};

export const resolveActorUserId = (req: AuthRequest): string => String(req.user!._id);

export const creatorObjectId = (req: AuthRequest) => companyObjectId(resolveActorUserId(req));

export const companyScope = (companyId: string | Types.ObjectId) => ({
  user_id: companyObjectId(companyId),
  isDeleted: false,
});

export const isCompanyOrHr = (user: IUser) =>
  user.role === role.company || user.role === role.hr || user.role === role.superadmin;

/** Company owner and HR users share full access to all rows under the same company (user_id scope). */
export const sharesCompanyHrmAdminAccess = (user: IUser) => isCompanyOrHr(user);

export const isEmployeeRole = (user: IUser) =>
  user.role === role.staff || user.role === role.hr;

/** Ownership / row-level checks in services (route middleware handles API gate). */
export const hasPermission = (user: IUser, permission: TPermissionKey) =>
  hasUserPermission(user, permission);

export type OwnershipFilter = {
  canManageAny: boolean;
  canManageOwn: boolean;
  actorId: Types.ObjectId;
};

export const resolveOwnership = (
  req: AuthRequest,
  manageAnyPerm: TPermissionKey,
  manageOwnPerm: TPermissionKey,
): OwnershipFilter => {
  const user = req.user!;
  const actorId = companyObjectId(resolveActorUserId(req));
  if (sharesCompanyHrmAdminAccess(user)) {
    return { canManageAny: true, canManageOwn: true, actorId };
  }
  return {
    canManageAny: hasPermission(user, manageAnyPerm),
    canManageOwn: hasPermission(user, manageOwnPerm),
    actorId,
  };
};

/** manage-any-* vs manage-own-* on creator_id / employee_id (staff only; company/hr use full company scope). */
export const applyOwnershipToQuery = <T extends { creator_id?: Types.ObjectId; employee_id?: Types.ObjectId }>(
  base: FilterQuery<T>,
  ownership: OwnershipFilter,
  opts?: { employeeField?: boolean }
) => {
  if (ownership.canManageAny) return base;
  if (!ownership.canManageOwn) {
    return { ...base, _id: { $exists: false } } as FilterQuery<T>;
  }
  const or: FilterQuery<T>[] = [{ creator_id: ownership.actorId } as FilterQuery<T>];
  if (opts?.employeeField) {
    or.push({ employee_id: ownership.actorId } as FilterQuery<T>);
  }
  return { ...base, $or: or };
};

/** Local calendar midnight (stored as UTC instant — use formatDateOnly in API responses). */
export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/** Local calendar end (23:59:59.999). Pair with startOfDay for day-span queries. */
export const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

/** Mongo filter: record date range overlaps the given calendar day (holiday/leave vs attendance). */
export const spansCalendarDay = (date: Date) => ({
  start_date: { $lte: endOfDay(date) },
  end_date: { $gte: startOfDay(date) },
});

/** Calendar date for API: `2026-05-23` (avoids UTC ISO showing previous day). */
export const formatDateOnly = (value: Date | string | undefined): string | undefined => {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const parseDate = (value: unknown, field = "date"): Date => {
  if (!value) throw new AppError(httpStatus.BAD_REQUEST, `${field} is required`);
  const raw = String(value).trim();
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  const d = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(raw);
  if (Number.isNaN(d.getTime())) throw new AppError(httpStatus.BAD_REQUEST, `Invalid ${field}`);
  return d;
};

export const parseOptionalDate = (value: unknown): Date | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  return parseDate(value);
};

export const roundMoney = (n: number) => Math.round(n * 100) / 100;

export const formatUserRef = (u: { _id?: Types.ObjectId; name?: string; email?: string; image?: string } | null) =>
  u
    ? {
        _id: String(u._id),
        name: u.name ?? "",
        email: u.email ?? "",
        image: u.image ?? "",
      }
    : null;

/** Staff/hr users eligible for employee profile (same company). */
export const EMPLOYEE_USER_ROLES: TRole[] = [role.staff, role.hr];
