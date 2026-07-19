import { PERMISSION_VALUE_SET, TPermissionKey } from "./permission";

const moduleToSnake = (moduleKey: string) => moduleKey.replace(/-/g, "_");
export const asPermission = (value: string): TPermissionKey => {
  const key = value.replace(/-/g, "_");
  if (!PERMISSION_VALUE_SET.has(key)) {
    throw new Error(
      `[permissions] Unknown permission "${value}". Add it to rolePermission.ts.`,
    );
  }
  return key as TPermissionKey;
};

export const permModule = {
  manage: (moduleKey: string): TPermissionKey =>
    asPermission(`manage_${moduleToSnake(moduleKey)}`),
  manageAny: (moduleKey: string): TPermissionKey =>
    asPermission(`manage_any_${moduleToSnake(moduleKey)}`),
  manageOwn: (moduleKey: string): TPermissionKey =>
    asPermission(`manage_own_${moduleToSnake(moduleKey)}`),
  create: (moduleKey: string): TPermissionKey =>
    asPermission(`create_${moduleToSnake(moduleKey)}`),
  edit: (moduleKey: string): TPermissionKey =>
    asPermission(`edit_${moduleToSnake(moduleKey)}`),
  delete: (moduleKey: string): TPermissionKey =>
    asPermission(`delete_${moduleToSnake(moduleKey)}`),
  view: (moduleKey: string): TPermissionKey =>
    asPermission(`view_${moduleToSnake(moduleKey)}`),
};
