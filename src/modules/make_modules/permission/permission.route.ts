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

router.get(
  "/my-permissions",
  authMiddleware(role.company),
  permissionController.getPermissionsByCompany
);

export const permissionRoutes = router;
