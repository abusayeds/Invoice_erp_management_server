import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { addPaymentController } from "./payment.controller";

const router = express.Router();

router.post("/create", authMiddleware(role.user), addPaymentController.paymentCreate);
router.get("/all", authMiddleware(role.user), addPaymentController.paymentGetAll);
router.get("/:id", authMiddleware(role.user), addPaymentController.paymentSingle);
router.patch("/:id", authMiddleware(role.user), addPaymentController.paymentUpdate);
router.delete("/:id", authMiddleware(role.user), addPaymentController.paymentDelete);

export const paymentRoutes = router;