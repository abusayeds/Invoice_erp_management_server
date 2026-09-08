import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { goalContributionController } from "./goalContribution.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), goalContributionController.getAll);
router.post("/", authMiddleware(role.company), goalContributionController.create);
router.put("/:id", authMiddleware(role.company), goalContributionController.update);
router.delete("/:id", authMiddleware(role.company), goalContributionController.remove);

export const goalContributionRoutes = router;
