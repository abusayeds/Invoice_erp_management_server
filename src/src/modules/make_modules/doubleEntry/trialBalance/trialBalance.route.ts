import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { trialBalanceController } from "./trialBalance.controller";

const router = express.Router();

router.get("/print", authMiddleware(role.company), trialBalanceController.print);
router.get("/", authMiddleware(role.company), trialBalanceController.index);

export const trialBalanceRoutes = router;
