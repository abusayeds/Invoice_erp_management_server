import express from "express";
import { subscriptionController } from "./subscription.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
 
const router = express.Router();
 
router.post("/create", authMiddleware(role.admin),  subscriptionController.createSubscription);
router.get("/", authMiddleware(role.admin , role.user) , subscriptionController.getAllSubscriptions);
router.get("/:id", authMiddleware(role.admin , role.user) , subscriptionController.getSingleSubscription);
router.patch("/:id", authMiddleware(role.admin) , subscriptionController.updateSubscription);
router.delete("/:id",authMiddleware(role.admin), subscriptionController.deleteSubscription);
 
export const subscriptionRoutes = router;