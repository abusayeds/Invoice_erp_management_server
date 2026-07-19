/** Barrel — prefer `permission` from `permission.ts` (same pattern as `role`). */
export {
  permission,
  PERMISSION_SET,
  PERMISSION_VALUE_SET,
  PERMISSION_VALUES,
  isPermission,
  type TPermissionKey,
  type PermissionNav,
} from "./permission";

export {
  rolePermission,
  permissions,
  type PermissionTreeAddOn,
  type PermissionTreeItem,
  type PermissionTreeModule,
} from "./rolePermission";

export { asPermission, permModule } from "./permissionModule";
export { normalizePermission, parseValidPermissions } from "./permissionCatalog";
