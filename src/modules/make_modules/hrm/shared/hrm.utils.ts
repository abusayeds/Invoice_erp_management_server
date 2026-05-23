import httpStatus from "http-status";
import { FilterQuery, Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { role, TRole } from "../../../../utils/role";
import { IUser } from "../../../basic_modules/user/user.interface";
const normalizePermission = (key: string) => key.replace(/-/g, "_");

export const companyObjectId = (id: string | Types.ObjectId) =>
  id instanceof Types.ObjectId ? id : new Types.ObjectId(String(id));

/** Company tenant id from JWT (company login or staff/hr under company). */
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

export const isEmployeeRole = (user: IUser) =>
  user.role === role.staff || user.role === role.hr;

export const hasPermission = (user: IUser, permission: string) => {
  const key = normalizePermission(permission);
  return (
    user.role === role.superadmin ||
    (Array.isArray(user.permissions) &&
      user.permissions.some((p) => normalizePermission(String(p)) === key))
  );
};

export const assertPermission = (req: AuthRequest, permission: string) => {
  if (!req.user || !hasPermission(req.user, permission)) {
    throw new AppError(httpStatus.FORBIDDEN, "Permission denied");
  }
};

export type OwnershipFilter = {
  canManageAny: boolean;
  canManageOwn: boolean;
  actorId: Types.ObjectId;
};

export const resolveOwnership = (
  req: AuthRequest,
  manageAnyPerm: string,
  manageOwnPerm: string
): OwnershipFilter => {
  const user = req.user!;
  return {
    canManageAny: hasPermission(user, manageAnyPerm),
    canManageOwn: hasPermission(user, manageOwnPerm),
    actorId: companyObjectId(resolveActorUserId(req)),
  };
};

/** Laravel manage-any-* vs manage-own-* filter on creator_id / employee_id. */
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

export const parseDate = (value: unknown, field = "date"): Date => {
  if (!value) throw new AppError(httpStatus.BAD_REQUEST, `${field} is required`);
  const d = new Date(String(value));
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
