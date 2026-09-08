import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { recruitmentDashboardController } from "./recruitment.dashboard.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);

router.get(
  "/",
  auth,
  permissionMiddleware(permission.recruitment.recruitment.manage_recruitment_dashboard),
  recruitmentDashboardController.getDashboard
);

export const recruitmentDashboardRoutes = router;
