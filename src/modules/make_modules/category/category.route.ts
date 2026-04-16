import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { categoryController } from "./category.controller";

const router = express.Router();

router.post("/create", authMiddleware(role.admin), categoryController.createCategory);
router.get("/all", categoryController.getAllCategory);
router.get("/:id", categoryController.getSingleCategory);
router.patch("/:id", authMiddleware(role.admin), categoryController.updateCategory);
router.delete("/:id", authMiddleware(role.admin), categoryController.deleteCategory);

export const categoryRoutes = router;