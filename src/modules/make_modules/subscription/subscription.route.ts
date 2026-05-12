import express from "express";
import { subscriptionController } from "./subscription.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
 
const router = express.Router();
 
router.post("/create", authMiddleware(role.superadmin),  subscriptionController.createSubscription);
router.get("/", authMiddleware(role.superadmin , role.company) , subscriptionController.getAllSubscriptions);
router.get("/:id", authMiddleware(role.superadmin , role.company) , subscriptionController.getSingleSubscription);
router.patch("/:id", authMiddleware(role.superadmin) , subscriptionController.updateSubscription);
router.delete("/:id",authMiddleware(role.superadmin), subscriptionController.deleteSubscription);
 
export const subscriptionRoutes = router;