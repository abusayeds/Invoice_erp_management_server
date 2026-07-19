import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { goalTrackingController } from "./goalTracking.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), goalTrackingController.getAll);
router.post("/", authMiddleware(role.company), goalTrackingController.create);
router.get("/:id", authMiddleware(role.company), goalTrackingController.getSingle);
router.put("/:id", authMiddleware(role.company), goalTrackingController.update);
router.delete("/:id", authMiddleware(role.company), goalTrackingController.remove);

export const goalTrackingRoutes = router;
