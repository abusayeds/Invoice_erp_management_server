import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { hrmDashboardController } from "./hrm.dashboard.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);

router.get(
  "/",
  auth,
  permissionMiddleware(permission.hrm.dashboard.manage_hrm_dashboard),
  hrmDashboardController.getDashboard
);

export const hrmDashboardRoutes = router;
