import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { purchaseController } from "./purchase.controller";
 
const router = express.Router();
 
router.post("/create", authMiddleware(role.company),  purchaseController.purchaseSubscription);

export const purchaseRoutes = router;