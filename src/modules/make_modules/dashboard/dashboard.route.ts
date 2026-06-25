import express from "express";
import { projectDashboardRoutes } from "./project/project.dashboard.route";
import { accountDashboardRoutes } from "./account/account.dashboard.route";
import { hrmDashboardRoutes } from "./hrm/hrm.dashboard.route";
import { recruitmentDashboardRoutes } from "./recruitment/recruitment.dashboard.route";
import { crmDashboardRoutes } from "./crm/crm.dashboard.route";
import { supportDashboardRoutes } from "./support/support.dashboard.route";

const router = express.Router();

// One dashboard hub mirroring the Laravel "Dashboard" sidebar section.
router.use("/project", projectDashboardRoutes);
router.use("/account", accountDashboardRoutes);
router.use("/hrm", hrmDashboardRoutes);
router.use("/recruitment", recruitmentDashboardRoutes);
router.use("/crm", crmDashboardRoutes);
router.use("/support", supportDashboardRoutes);

export const dashboardRoutes = router;
