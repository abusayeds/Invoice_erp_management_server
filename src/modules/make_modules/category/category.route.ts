import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { categoryController } from "./category.controller";

const router = express.Router();

router.post("/create", authMiddleware(role.company), categoryController.createCategory);
router.get("/all", authMiddleware(role.company), categoryController.getAllCategory);
router.get("/:id", authMiddleware(role.company), categoryController.getSingleCategory);
router.patch("/:id", authMiddleware(role.company), categoryController.updateCategory);
router.delete("/:id", authMiddleware(role.company), categoryController.deleteCategory);

export const categoryRoutes = router;