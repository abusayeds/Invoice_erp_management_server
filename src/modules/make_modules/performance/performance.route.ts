import express from "express";
import { indicatorCategoryRoutes } from "./indicatorCategory/indicatorCategory.route";
import { indicatorRoutes } from "./indicator/indicator.route";
import { goalTypeRoutes } from "./goalType/goalType.route";
import { employeeGoalRoutes } from "./employeeGoal/employeeGoal.route";
import { reviewCycleRoutes } from "./reviewCycle/reviewCycle.route";
import { employeeReviewRoutes } from "./employeeReview/employeeReview.route";

const router = express.Router();

// System setup (config) resources
router.use("/indicator-categories", indicatorCategoryRoutes);
router.use("/indicators", indicatorRoutes);
router.use("/goal-types", goalTypeRoutes);
router.use("/review-cycles", reviewCycleRoutes);

// Operational resources
router.use("/employee-goals", employeeGoalRoutes);
router.use("/employee-reviews", employeeReviewRoutes);

export const performanceRoutes = router;
