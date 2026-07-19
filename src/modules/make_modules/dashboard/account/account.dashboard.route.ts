import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { accountDashboardController } from "./account.dashboard.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff, role.customer, role.vendor);

router.get(
  "/",
  auth,
  permissionMiddleware(permission.account.account.manage_account_dashboard),
  accountDashboardController.getDashboard
);

export const accountDashboardRoutes = router;
