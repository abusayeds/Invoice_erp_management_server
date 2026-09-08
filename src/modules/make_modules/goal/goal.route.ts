import express from "express";
import { goalCategoryRoutes } from "./goalCategory/goalCategory.route";
import { goalsRoutes } from "./goals/goal.route";
import { goalMilestoneRoutes } from "./goalMilestone/goalMilestone.route";
import { goalContributionRoutes } from "./goalContribution/goalContribution.route";
import { goalTrackingRoutes } from "./goalTracking/goalTracking.route";

const router = express.Router();

router.use("/categories", goalCategoryRoutes);
router.use("/goals", goalsRoutes);
router.use("/milestones", goalMilestoneRoutes);
router.use("/contributions", goalContributionRoutes);
router.use("/tracking", goalTrackingRoutes);

export const goalRoutes = router;
