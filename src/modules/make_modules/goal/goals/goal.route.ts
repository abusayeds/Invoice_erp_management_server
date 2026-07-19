import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { goalController } from "./goal.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), goalController.getAll);
router.post("/", authMiddleware(role.company), goalController.create);
router.get("/:id", authMiddleware(role.company), goalController.getSingle);
router.put("/:id", authMiddleware(role.company), goalController.update);
router.post("/activate/:id", authMiddleware(role.company), goalController.activate);
router.delete("/:id", authMiddleware(role.company), goalController.remove);

export const goalsRoutes = router;
