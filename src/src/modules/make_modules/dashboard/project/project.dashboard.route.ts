import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { projectDashboardController } from "./project.dashboard.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff, role.customer);

router.get(
  "/",
  auth,
  permissionMiddleware(permission.taskly.project.manage_project_dashboard),
  projectDashboardController.getDashboard
);

export const projectDashboardRoutes = router;
