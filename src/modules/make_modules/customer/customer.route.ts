import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { customerController } from "./customer.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.user),
  customerController.customerCreate
);
router.get(
  "/all",
  authMiddleware(role.user),
  customerController.allCustomer
);
router.get(
  "/single/:id",
  authMiddleware(role.user),
  customerController.singleCustomer
);
router.post(
  "/delete",
  authMiddleware(role.user),
  customerController.deleteCustomer
);
router.post(
  "/update",
  authMiddleware(role.user),
  customerController.updateCustomer
);


export const customerRoutes = router;