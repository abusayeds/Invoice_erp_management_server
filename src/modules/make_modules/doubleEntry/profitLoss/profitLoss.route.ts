import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { profitLossController } from "./profitLoss.controller";

const router = express.Router();

router.get("/print", authMiddleware(role.company), profitLossController.print);
router.get("/", authMiddleware(role.company), profitLossController.index);

export const profitLossRoutes = router;
