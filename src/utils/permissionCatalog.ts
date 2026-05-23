import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { permissions as catalogPermissions } from "./rolePermission";

const VALID_PERMISSION_SET = new Set(catalogPermissions);

export const normalizePermission = (key: string) => key.replace(/-/g, "_");

/** Only values from rolePermission `permissions` catalog (snake_case stored). */
export const parseValidPermissions = (input: unknown): string[] => {
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
    normalized.push(key);
  }

  if (invalid.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid permission(s): ${[...new Set(invalid)].join(", ")}`,
    );
  }

  return [...new Set(normalized)];
};
