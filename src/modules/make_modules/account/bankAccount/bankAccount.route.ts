import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { bankAccountController } from "./bankAccount.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), bankAccountController.getAll);
router.get("/api/list", authMiddleware(role.company), bankAccountController.listApi);
router.post("/create", authMiddleware(role.company), bankAccountController.create);
router.patch("/edit/:id", authMiddleware(role.company), bankAccountController.update);
router.delete("/delete/:id", authMiddleware(role.company), bankAccountController.remove);

export const bankAccountRoutes = router;
