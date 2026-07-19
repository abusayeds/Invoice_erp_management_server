import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { budgetController } from "./budget.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), budgetController.getAll);
router.post("/", authMiddleware(role.company), budgetController.create);
router.post("/approve/:id", authMiddleware(role.company), budgetController.approve);
router.post("/active/:id", authMiddleware(role.company), budgetController.active);
router.post("/close/:id", authMiddleware(role.company), budgetController.close);
router.put("/:id", authMiddleware(role.company), budgetController.update);
router.delete("/:id", authMiddleware(role.company), budgetController.remove);

export const budgetRoutes = router;
