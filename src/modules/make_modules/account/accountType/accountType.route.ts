import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { accountTypeController } from "./accountType.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), accountTypeController.getAll);
router.post("/create", authMiddleware(role.company), accountTypeController.create);
router.patch("/edit/:id", authMiddleware(role.company), accountTypeController.update);
router.delete("/delete/:id", authMiddleware(role.company), accountTypeController.remove);

export const accountTypeRoutes = router;
