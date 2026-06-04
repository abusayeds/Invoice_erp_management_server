import httpStatus from "http-status";
import { Schema } from "mongoose";
import { FilterQuery, Types } from "mongoose";
import AppError from "../../../errors/AppError";
import { UserModel } from "../../basic_modules/user/user.model";

// Reuse the generic company-scope / ownership helpers (same semantics as Laravel created_by + creator_id).
import {
  OwnershipFilter,
  applyOwnershipToQuery,
  companyObjectId,
  companyScope,
  creatorObjectId,
  formatDateOnly,
  parseDate,
  parseOptionalDate,
  resolveCompanyId,
  resolveOwnership,
} from "../hrm/shared/hrm.utils";

export {
  applyOwnershipToQuery,
  companyObjectId,
  companyScope,
  creatorObjectId,
  formatDateOnly,
  parseDate,
  parseOptionalDate,
  resolveCompanyId,
  resolveOwnership,
};
export type { OwnershipFilter };

/** Ensure a referenced user is an employee under the same company (Laravel User::emp()->where created_by). */
export const assertEmployeeUser = async (
  userId: unknown,
  companyId: string | Types.ObjectId,
  label = "Employee"
) => {
  if (!userId || !Types.ObjectId.isValid(String(userId))) {
    throw new AppError(httpStatus.BAD_REQUEST, `Valid ${label.toLowerCase()} is required`);
  }
  const user = await UserModel.findOne({
    _id: userId,
    companyId: companyObjectId(companyId),
    isDeleted: false,
  });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, `${label} not found in your company`);
  }
  return user;
};

/** Base fields shared by every performance table (Laravel created_by → user_id, creator_id, soft delete). */
export const performanceBaseFields = {
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  creator_id: { type: Schema.Types.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false },
};

/**
 * Employee review ownership (manage-own → creator_id | reviewer_id | employee_user_id == actor).
 * Mirrors EmployeeReviewController::canAccessReview / index scope in Laravel.
 */
export const applyReviewOwnership = <
  T extends {
    creator_id?: Types.ObjectId;
    reviewer_id?: Types.ObjectId;
    employee_user_id?: Types.ObjectId;
  }
>(
  base: FilterQuery<T>,
  ownership: OwnershipFilter
): FilterQuery<T> => {
  if (ownership.canManageAny) return base;
  if (!ownership.canManageOwn) {
    return { ...base, _id: { $exists: false } } as FilterQuery<T>;
  }
  return {
    ...base,
    $or: [
      { creator_id: ownership.actorId } as FilterQuery<T>,
      { reviewer_id: ownership.actorId } as FilterQuery<T>,
      { employee_user_id: ownership.actorId } as FilterQuery<T>,
    ],
  };
};
