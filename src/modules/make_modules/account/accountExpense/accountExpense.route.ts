import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { accountExpenseController } from "./accountExpense.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), accountExpenseController.getAll);
router.post("/create", authMiddleware(role.company), accountExpenseController.create);
router.patch("/edit/:id", authMiddleware(role.company), accountExpenseController.update);
router.delete("/delete/:id", authMiddleware(role.company), accountExpenseController.remove);
router.post("/approve/:id", authMiddleware(role.company), accountExpenseController.approve);
router.post("/post/:id", authMiddleware(role.company), accountExpenseController.post);

export const accountExpenseRoutes = router;
