import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { goalCategoryController } from "./goalCategory.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), goalCategoryController.getAll);
router.post("/", authMiddleware(role.company), goalCategoryController.create);
router.put("/:id", authMiddleware(role.company), goalCategoryController.update);
router.delete("/:id", authMiddleware(role.company), goalCategoryController.remove);

export const goalCategoryRoutes = router;
