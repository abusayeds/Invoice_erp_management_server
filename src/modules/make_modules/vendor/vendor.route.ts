import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { vendorController } from "./vendor.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.company),
  vendorController.vendorCreate
);
router.get(
  "/all",
  authMiddleware(role.company),
  vendorController.allVendor
);
router.get(
  "/single/:id",
  authMiddleware(role.company),
  vendorController.singleVendor
);
router.post(
  "/delete",
  authMiddleware(role.company),
  vendorController.deleteVendor
);
router.post(
  "/update",
  authMiddleware(role.company),
  vendorController.updateVendor
);


export const vendorRoutes = router;