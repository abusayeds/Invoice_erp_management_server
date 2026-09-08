
import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { statusController } from "./status.controller";

const router = express.Router();
router.get("/graphChart" , authMiddleware(role.company), statusController.graphChart);
router.get("/top-customers" , authMiddleware(role.company), statusController.topCustomer);
router.get("/top-products" , authMiddleware(role.company), statusController.topProducts);
router.get("/:date" , authMiddleware(role.company), statusController.getStatusData);
export const statusRoutes = router;