import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { dashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), dashboardController.index);

export const dashboardRoutes = router;
