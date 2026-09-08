import express from "express";
import { budgetPeriodRoutes } from "./budgetPeriod/budgetPeriod.route";
import { budgetRoutes } from "./budgets/budget.route";
import { budgetAllocationRoutes } from "./budgetAllocation/budgetAllocation.route";
import { budgetMonitoringRoutes } from "./budgetMonitoring/budgetMonitoring.route";

const router = express.Router();

router.use("/budget-periods", budgetPeriodRoutes);
router.use("/budgets", budgetRoutes);
router.use("/budget-allocations", budgetAllocationRoutes);
router.use("/budget-monitoring", budgetMonitoringRoutes);

export const budgetPlannerRoutes = router;
