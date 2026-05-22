import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { expenseCategoryController } from "./expenseCategory.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), expenseCategoryController.getAll);
router.post("/create", authMiddleware(role.company), expenseCategoryController.create);
router.patch("/edit/:id", authMiddleware(role.company), expenseCategoryController.update);
router.delete("/delete/:id", authMiddleware(role.company), expenseCategoryController.remove);

export const expenseCategoryRoutes = router;
