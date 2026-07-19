import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { revenueCategoryController } from "./revenueCategory.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), revenueCategoryController.getAll);
router.post("/create", authMiddleware(role.company), revenueCategoryController.create);
router.patch("/edit/:id", authMiddleware(role.company), revenueCategoryController.update);
router.delete("/delete/:id", authMiddleware(role.company), revenueCategoryController.remove);

export const revenueCategoryRoutes = router;
