import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { vendorController } from "./vendor.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.user),
  vendorController.vendorCreate
);
router.get(
  "/all",
  authMiddleware(role.user),
  vendorController.allVendor
);
router.get(
  "/single/:id",
  authMiddleware(role.user),
  vendorController.singleVendor
);
router.post(
  "/delete",
  authMiddleware(role.user),
  vendorController.deleteVendor
);


export const vendorRoutes = router;