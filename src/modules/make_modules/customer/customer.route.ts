import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { customerController } from "./customer.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.company),
  customerController.customerCreate
);
router.get(
  "/all",
  authMiddleware(role.company),
  customerController.allCustomer
);
router.get(
  "/single/:id",
  authMiddleware(role.company),
  customerController.singleCustomer
);
router.post(
  "/delete",
  authMiddleware(role.company),
  customerController.deleteCustomer
);
router.post(
  "/update",
  authMiddleware(role.company),
  customerController.updateCustomer
);


export const customerRoutes = router;