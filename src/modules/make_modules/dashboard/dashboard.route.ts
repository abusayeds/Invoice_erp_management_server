import express from "express";
import { projectDashboardRoutes } from "./project/project.dashboard.route";
import { accountDashboardRoutes } from "./account/account.dashboard.route";
import { hrmDashboardRoutes } from "./hrm/hrm.dashboard.route";
import { recruitmentDashboardRoutes } from "./recruitment/recruitment.dashboard.route";

const router = express.Router();

// One dashboard hub mirroring the Laravel "Dashboard" sidebar section.
router.use("/project", projectDashboardRoutes);
router.use("/account", accountDashboardRoutes);
router.use("/hrm", hrmDashboardRoutes);
router.use("/recruitment", recruitmentDashboardRoutes);

export const dashboardRoutes = router;
