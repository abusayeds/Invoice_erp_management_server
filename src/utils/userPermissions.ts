import { IUser } from "../modules/basic_modules/user/user.interface";
import { normalizePermission } from "./permissionCatalog";
import { TPermissionKey } from "./permission";
import { role } from "./role";

export const hasUserPermission = (user: IUser, permission: TPermissionKey): boolean => {
  const key = normalizePermission(permission);
  return (
    user.role === role.superadmin ||
    (Array.isArray(user.permissions) &&
      user.permissions.some((p) => normalizePermission(String(p)) === key))
  );
};

/** User needs at least one of the listed permissions. */
export const hasAnyUserPermission = (
  user: IUser,
  permissions: TPermissionKey[],
): boolean =>
  permissions.some((p) => hasUserPermission(user, p));

/** Permissions from the list the user does not have (superadmin → none missing). */
export const getMissingPermissions = (
  user: IUser,
  permissions: TPermissionKey[],
): TPermissionKey[] => {
  if (user.role === role.superadmin) return [];
  return permissions.filter((p) => !hasUserPermission(user, p));
};

/** Permissions from the list the user satisfies. */
export const getGrantedPermissions = (
  user: IUser,
  permissions: TPermissionKey[],
): TPermissionKey[] => permissions.filter((p) => hasUserPermission(user, p));
