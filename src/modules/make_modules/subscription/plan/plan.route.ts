import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { planController } from "./plan.controller";

const router = express.Router();

router.get("/catalog", authMiddleware(role.superadmin), planController.catalog);

router.get("/", authMiddleware(role.superadmin, role.company), planController.getAll);
router.get("/:id", authMiddleware(role.superadmin, role.company), planController.getSingle);

// Admin CRUD
router.post("/create", authMiddleware(role.superadmin), planController.create);
router.patch("/:id", authMiddleware(role.superadmin), planController.update);
router.delete("/:id", authMiddleware(role.superadmin), planController.remove);

export const planRoutes = router;
