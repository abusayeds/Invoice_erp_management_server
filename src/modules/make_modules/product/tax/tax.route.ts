import express from "express";
import { taxController } from "./tax.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();

router.post("/create", authMiddleware(role.company), taxController.createTax);
router.get("/all", authMiddleware(role.company), taxController.getAllTax);
router.get("/:id", authMiddleware(role.company), taxController.getSingleTax);
router.patch("/:id", authMiddleware(role.company), taxController.updateTax);
router.delete("/:id", authMiddleware(role.company), taxController.deleteTax);

export const taxRoutes = router;
