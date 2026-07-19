import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { permModule } from "../../../../utils/permissionModule";
import { role } from "../../../../utils/role";

/** HRM routes: JWT + role company | hr | staff */
export const hrmAuth = authMiddleware(role.company, role.hr, role.staff);

export const perm = permissionMiddleware;

/** Dot access like `role.company` — `permission.hrm.leave_types.manage_leave_types` */
export { permission };

/** Standard CRUD permissions for master/workflow resources (moduleKey = registry key). */
export const crudPerms = (moduleKey: string) => ({
  list: perm(permModule.manage(moduleKey)),
  get: perm(permModule.manage(moduleKey)),
  create: perm(permModule.create(moduleKey)),
  edit: perm(permModule.edit(moduleKey)),
  delete: perm(permModule.delete(moduleKey)),
});
