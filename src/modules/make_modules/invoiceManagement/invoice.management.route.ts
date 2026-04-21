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
router.get(
  "/single/:id",
  authMiddleware(role.user),
  invoiceManagementController.invoiceManagementGetSingle
);
router.get(
  "/all",
  authMiddleware(role.user),
  invoiceManagementController.invoiceManagementGetAll
);

export const invoiceManagementRoutes = router;