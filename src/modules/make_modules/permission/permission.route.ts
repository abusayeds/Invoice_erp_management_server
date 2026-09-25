import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { permissionController } from "./permission.controller";

const router = express.Router();

router.patch(
  "/update-permission",
  authMiddleware(role.company),
  permissionController.updatePermission
);

router.post(
  "/create-role",
  authMiddleware(role.company),
  permissionController.createRole
);

router.delete(
  "/delete-role/:role",
  authMiddleware(role.company),
  permissionController.deleteRole
);

router.patch(
  "/rename-role",
  authMiddleware(role.company),
  permissionController.renameRole
);

router.patch(
  "/update-user-permission",
  authMiddleware(role.company),
  permissionController.updateUserPermission
);

router.get(
  "/my-permissions",
  authMiddleware(role.company),
  permissionController.getPermissionsByCompany
);

router.get(
  "/all-permissions",
  authMiddleware(role.superadmin, role.company),
  permissionController.getAllPermissions,
);

router.patch(
  "/role-active",
  authMiddleware(role.company),
  permissionController.setRoleActive,
);

export const permissionRoutes = router;
