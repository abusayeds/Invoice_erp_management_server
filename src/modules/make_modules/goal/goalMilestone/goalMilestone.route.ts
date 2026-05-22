import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { goalMilestoneController } from "./goalMilestone.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), goalMilestoneController.getAll);
router.post("/", authMiddleware(role.company), goalMilestoneController.create);
router.get("/:id", authMiddleware(role.company), goalMilestoneController.getSingle);
router.put("/:id", authMiddleware(role.company), goalMilestoneController.update);
router.delete("/:id", authMiddleware(role.company), goalMilestoneController.remove);

export const goalMilestoneRoutes = router;
