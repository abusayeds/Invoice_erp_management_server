import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { customerPaymentController } from "./customerPayment.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), customerPaymentController.getAll);
router.post("/create", authMiddleware(role.company), customerPaymentController.create);
router.get(
  "/customers/:customerId/outstanding",
  authMiddleware(role.company),
  customerPaymentController.getOutstanding
);
router.patch(
  "/update-status/:id",
  authMiddleware(role.company),
  customerPaymentController.updateStatus
);
router.delete("/delete/:id", authMiddleware(role.company), customerPaymentController.remove);

export const customerPaymentRoutes = router;
