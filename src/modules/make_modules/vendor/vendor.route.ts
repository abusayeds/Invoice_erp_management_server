import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { enforcePlanLimit } from "../subscription/guard/subscription.guard";
import { vendorController } from "./vendor.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.company),
  enforcePlanLimit("users"),
  vendorController.vendorCreate
);

router.get(
  "/all",
  authMiddleware(role.company),
  vendorController.allVendor
);

router.get(
  "/return-list",
  authMiddleware(role.company),
  vendorController.VendorReturnList
);
router.get(
  "/single/:id",
  authMiddleware(role.company),
  vendorController.singleVendor
);
router.delete(
  "/delete/:id",
  authMiddleware(role.company),
  vendorController.deleteVendor
);
// Permanent delete from Trash — new, additive endpoint.
router.delete(
  "/hard-delete/:id",
  authMiddleware(role.company),
  vendorController.hardDeleteVendor
);
router.post(
  "/update",
  authMiddleware(role.company),
  vendorController.updateVendor
);


router.post(
  "/merge",
  authMiddleware(role.company),
  vendorController.mergeVendors
);

export const vendorRoutes = router;