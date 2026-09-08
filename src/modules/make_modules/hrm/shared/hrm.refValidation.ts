import httpStatus from "http-status";
import { FilterQuery, Model, Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { UserModel } from "../../../basic_modules/user/user.model";
import { companyObjectId, companyScope, EMPLOYEE_USER_ROLES } from "./hrm.utils";

export const parseObjectId = (value: unknown, field: string, label?: string): string => {
  if (value === undefined || value === null || value === "") {
    throw new AppError(httpStatus.BAD_REQUEST, `${label ?? field} is required`);
  }
  const raw = String(value).trim();
  if (!Types.ObjectId.isValid(raw)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid ${label ?? field}: must be a valid id`);
  }
  return raw;
};

export const parseOptionalObjectId = (
  value: unknown,
  field: string,
  label?: string,
): string | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const raw = String(value).trim();
  if (!Types.ObjectId.isValid(raw)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid ${label ?? field}: must be a valid id`);
  }
  return raw;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const assertCompanyDocument = async (
  companyId: string,
  model: Model<any>,
  id: string,
  label: string,
) => {
  const found = await model
    .findOne({ _id: companyObjectId(id), ...companyScope(companyId) } as FilterQuery<unknown>)
    .select("_id")
    .lean();
  if (!found) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid ${label}: not found in your company`,
    );
  }
};

export const assertCompanyEmployeeUser = async (
  companyId: string,
  userId: string,
  label = "Employee",
) => {
  const user = await UserModel.findOne({
    _id: companyObjectId(userId),
    companyId: companyObjectId(companyId),
    role: { $in: EMPLOYEE_USER_ROLES },
    isDeleted: false,
  })
    .select("_id")
    .lean();
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid ${label}: employee not found in your company`,
    );
  }
};

export const assertCompanyMemberUser = async (
  companyId: string,
  userId: string,
  label = "User",
) => {
  const user = await UserModel.findOne({
    _id: companyObjectId(userId),
    companyId: companyObjectId(companyId),
    isDeleted: false,
  })
    .select("_id")
    .lean();
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid ${label}: user not found in your company`,
    );
  }
};

export type HrmRefRule = {
  field: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model?: Model<any>;
  kind: "companyDoc" | "employeeUser" | "companyUser";
  required?: boolean;
};

const hasField = (body: Record<string, unknown>, field: string) =>
  body[field] !== undefined && body[field] !== null && body[field] !== "";

/** Validate and normalize ObjectId reference fields on create/update payloads. */
export const validateHrmRefs = async (
  companyId: string,
  body: Record<string, unknown>,
  rules: HrmRefRule[],
  opts?: { partial?: boolean },
) => {
  for (const rule of rules) {
    if (opts?.partial && !hasField(body, rule.field)) continue;

    const raw = body[rule.field];
    if (raw === undefined || raw === null || raw === "") {
      if (rule.required && !opts?.partial) {
        throw new AppError(httpStatus.BAD_REQUEST, `${rule.label} is required`);
      }
      continue;
    }

    const id = parseObjectId(raw, rule.field, rule.label);
    body[rule.field] = companyObjectId(id);

    if (rule.kind === "companyDoc") {
      if (!rule.model) {
        throw new Error(`validateHrmRefs: model required for ${rule.field}`);
      }
      await assertCompanyDocument(companyId, rule.model, id, rule.label);
    } else if (rule.kind === "employeeUser") {
      await assertCompanyEmployeeUser(companyId, id, rule.label);
    } else {
      await assertCompanyMemberUser(companyId, id, rule.label);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateObjectIdArray = async (
  companyId: string,
  body: Record<string, unknown>,
  field: string,
  model: Model<any>,
  label: string,
  opts?: { partial?: boolean },
) => {
  if (opts?.partial && body[field] === undefined) return;
  const raw = body[field];
  if (raw === undefined || raw === null) return;
  if (!Array.isArray(raw)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${label} must be an array of ids`);
  }
  const ids: Types.ObjectId[] = [];
  for (const item of raw) {
    const id = parseObjectId(item, field, label);
    await assertCompanyDocument(companyId, model, id, label);
    ids.push(companyObjectId(id));
  }
  body[field] = ids;
};
