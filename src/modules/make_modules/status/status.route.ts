
import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { statusController } from "./status.controller";

const router = express.Router();
router.get("/graphChart" , authMiddleware(role.user), statusController.graphChart);
router.get("/top-customers" , authMiddleware(role.user), statusController.topCustomer);
router.get("/top-products" , authMiddleware(role.user), statusController.topProducts);
router.get("/:date" , authMiddleware(role.user), statusController.getStatusData);
export const statusRoutes = router;