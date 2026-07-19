import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { accountCategoryController } from "./accountCategory.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), accountCategoryController.getAll);
router.post("/create", authMiddleware(role.company), accountCategoryController.create);
router.patch("/edit/:id", authMiddleware(role.company), accountCategoryController.update);
router.delete("/delete/:id", authMiddleware(role.company), accountCategoryController.remove);

export const accountCategoryRoutes = router;
