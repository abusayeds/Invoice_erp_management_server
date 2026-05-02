import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { categoryController } from "./category.controller";

const router = express.Router();

router.post("/create", authMiddleware(role.user), categoryController.createCategory);
router.get("/all", authMiddleware(role.user), categoryController.getAllCategory);
router.get("/:id", authMiddleware(role.user), categoryController.getSingleCategory);
router.patch("/:id", authMiddleware(role.user), categoryController.updateCategory);
router.delete("/:id", authMiddleware(role.user), categoryController.deleteCategory);

export const categoryRoutes = router;