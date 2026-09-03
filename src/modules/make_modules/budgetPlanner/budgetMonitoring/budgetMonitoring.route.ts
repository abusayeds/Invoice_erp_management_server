import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { budgetMonitoringController } from "./budgetMonitoring.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), budgetMonitoringController.getAll);

export const budgetMonitoringRoutes = router;
