import express from "express";
import { planRoutes } from "./plan/plan.route";
import { checkoutRoutes } from "./checkout/checkout.route";

const router = express.Router();

router.use("/plans", planRoutes);

router.use("/", checkoutRoutes);

export const subscriptionRoutes = router;
