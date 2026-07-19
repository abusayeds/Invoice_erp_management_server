import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { PERMISSION_VALUE_SET, PERMISSION_VALUES, type TPermissionKey } from "./permission";

const VALID_PERMISSION_SET = PERMISSION_VALUE_SET;
export { PERMISSION_VALUES as catalogPermissions };
export const normalizePermission = (key: string) => key.replace(/-/g, "_");
export const parseValidPermissions = (input: unknown): TPermissionKey[] => {
  if (!Array.isArray(input)) {
    throw new AppError(httpStatus.BAD_REQUEST, "permissions must be an array");
  }
  const normalized: string[] = [];
  const invalid: string[] = [];
  for (const raw of input) {
    if (typeof raw !== "string" || !raw.trim()) {
      invalid.push(String(raw));
      continue;
    }
    const key = normalizePermission(raw.trim());
    if (!VALID_PERMISSION_SET.has(key)) {
      invalid.push(raw);
      continue;
    }
    normalized.push(key as TPermissionKey);
  }

  if (invalid.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid permission(s): ${[...new Set(invalid)].join(", ")}`,
    );
  }

  return [...new Set(normalized)] as TPermissionKey[];
};
