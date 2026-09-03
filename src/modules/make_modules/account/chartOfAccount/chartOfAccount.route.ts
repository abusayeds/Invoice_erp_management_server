import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { chartOfAccountController } from "./chartOfAccount.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), chartOfAccountController.getAll);
router.get("/single/:id", authMiddleware(role.company), chartOfAccountController.getSingle);
router.post("/create", authMiddleware(role.company), chartOfAccountController.create);
router.patch("/edit/:id", authMiddleware(role.company), chartOfAccountController.update);
router.delete("/delete/:id", authMiddleware(role.company), chartOfAccountController.remove);

export const chartOfAccountRoutes = router;
