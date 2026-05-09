import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { addPaymentController } from "./payment.controller";

const router = express.Router();

router.post("/create", authMiddleware(role.company), addPaymentController.paymentCreate);
router.get("/all", authMiddleware(role.company), addPaymentController.paymentGetAll);
router.get("/:id", authMiddleware(role.company), addPaymentController.paymentSingle);
router.patch("/:id", authMiddleware(role.company), addPaymentController.paymentUpdate);
router.delete("/:id", authMiddleware(role.company), addPaymentController.paymentDelete);

export const paymentRoutes = router;