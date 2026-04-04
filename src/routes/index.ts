import express from "express";
import { UserRoutes } from "../modules/basic_modules/user/user.route";
import { managementRoutes } from "../modules/basic_modules/management/management.route";
import { subscriptionRoutes } from "../modules/make_modules/subscription/subscription.route";
import { purchaseRoutes } from "../modules/make_modules/purchasePlan/purchase.route";
import { companyRoutes } from "../modules/make_modules/company/company.route";
import uploadRouter from "../fileUpload/route";
import { statusRoutes } from "../modules/make_modules/status/status.route";
const router = express.Router();
router.use("/api/v1/file-upload", uploadRouter);
router.use("/api/v1/user", UserRoutes);
router.use("/api/v1/management", managementRoutes);
router.use("/api/v1/subscription", subscriptionRoutes);
router.use("/api/v1/purchase", purchaseRoutes);
router.use("/api/v1/company", companyRoutes);
router.use("/api/v1/status", statusRoutes);


export default router;
