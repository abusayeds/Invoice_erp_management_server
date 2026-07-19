import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { vendorPaymentController } from "./vendorPayment.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), vendorPaymentController.getAll);
router.post("/create", authMiddleware(role.company), vendorPaymentController.create);
router.get(
  "/vendors/:vendorId/outstanding",
  authMiddleware(role.company),
  vendorPaymentController.getOutstanding
);
router.patch(
  "/update-status/:id",
  authMiddleware(role.company),
  vendorPaymentController.updateStatus
);
router.delete("/delete/:id", authMiddleware(role.company), vendorPaymentController.remove);

export const vendorPaymentRoutes = router;
