import express from "express";
import { paymentMethodController } from "./paymentMethod.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();

router.post("/create", authMiddleware(role.company), paymentMethodController.createPaymentMethod);
router.get("/all", authMiddleware(role.company), paymentMethodController.getAllPaymentMethod);
router.get("/:id", authMiddleware(role.company), paymentMethodController.getSinglePaymentMethod);
router.patch("/:id", authMiddleware(role.company), paymentMethodController.updatePaymentMethod);
router.delete("/:id", authMiddleware(role.company), paymentMethodController.deletePaymentMethod);

export const paymentMethodRoutes = router;
