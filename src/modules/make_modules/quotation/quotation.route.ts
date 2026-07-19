import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { quotationController } from "./quotation.controller";

const router = express.Router();

router.post("/create", authMiddleware(role.company), quotationController.create);

router.get("/single/:id", authMiddleware(role.company), quotationController.getSingle);

router.get("/all", authMiddleware(role.company), quotationController.getAll);

router.patch("/edit/:id", authMiddleware(role.company), quotationController.update);

router.delete("/delete/:id", authMiddleware(role.company), quotationController.remove);

export const quotationRoutes = router;
