import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { invoiceManagementController } from "./invoice.management.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.user),
  invoiceManagementController.invoiceManagementCreate
);

export const invoiceManagementRoutes = router;