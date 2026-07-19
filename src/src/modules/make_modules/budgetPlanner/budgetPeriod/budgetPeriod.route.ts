import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { budgetPeriodController } from "./budgetPeriod.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), budgetPeriodController.getAll);
router.post("/", authMiddleware(role.company), budgetPeriodController.create);
router.post("/approve/:id", authMiddleware(role.company), budgetPeriodController.approve);
router.post("/active/:id", authMiddleware(role.company), budgetPeriodController.active);
router.post("/close/:id", authMiddleware(role.company), budgetPeriodController.close);
router.put("/:id", authMiddleware(role.company), budgetPeriodController.update);
router.delete("/:id", authMiddleware(role.company), budgetPeriodController.remove);

export const budgetPeriodRoutes = router;
