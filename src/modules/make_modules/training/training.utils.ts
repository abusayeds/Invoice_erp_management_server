import httpStatus from "http-status";
import { Schema, Types, Model } from "mongoose";
import AppError from "../../../errors/AppError";
import { UserModel } from "../../basic_modules/user/user.model";
import { HrmBranchModel, HrmDepartmentModel } from "../hrm/models/master.models";

// Reuse the generic company-scope / ownership helpers (Laravel created_by + creator_id).
import {
  OwnershipFilter,
  applyOwnershipToQuery,
  companyObjectId,
  companyScope,
  creatorObjectId,
  formatDateOnly,
  parseDate,
  parseOptionalDate,
  resolveActorUserId,
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
  resolveActorUserId,
  resolveCompanyId,
  resolveOwnership,
};
export type { OwnershipFilter };

/** Base fields shared by every training table (Laravel created_by -> user_id, creator_id, soft delete). */
export const trainingBaseFields = {
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  creator_id: { type: Schema.Types.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false },
};

/** Validate an optional ObjectId ref that must belong to the same company (user_id scope). */
export const assertCompanyRef = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  id: unknown,
  companyId: string | Types.ObjectId,
  label: string
) => {
  if (id === undefined || id === null || id === "") return;
  if (!Types.ObjectId.isValid(String(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, `Valid ${label.toLowerCase()} is required`);
  }
  const found = await model.findOne({
    _id: id,
    user_id: companyObjectId(companyId),
    isDeleted: false,
  });
  if (!found) {
    throw new AppError(httpStatus.BAD_REQUEST, `${label} not found in your company`);
  }
};

export const assertHrmBranch = (id: unknown, companyId: string | Types.ObjectId) =>
  assertCompanyRef(HrmBranchModel, id, companyId, "Branch");

export const assertHrmDepartment = (id: unknown, companyId: string | Types.ObjectId) =>
  assertCompanyRef(HrmDepartmentModel, id, companyId, "Department");

/** Ensure a referenced user is an employee under the same company (Laravel User::emp()). */
export const assertEmployeeUser = async (
  userId: unknown,
  companyId: string | Types.ObjectId,
  label = "Employee"
) => {
  if (userId === undefined || userId === null || userId === "") return;
  if (!Types.ObjectId.isValid(String(userId))) {
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

/** Minimal {_id,name} ref shaping for responses. `field` is the label field on the ref (default "name"). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const refName = (ref: any, field = "name") =>
  ref && typeof ref === "object" && ref._id
    ? { _id: ref._id, name: ref[field] ?? null }
    : ref ?? null;
