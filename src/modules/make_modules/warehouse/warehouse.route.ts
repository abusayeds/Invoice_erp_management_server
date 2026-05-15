import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { warehouseController } from "./warehouse.controller";
import { transferRoutes } from "./transfer/transfer.route";

const router = express.Router();

router.use("/transfer", transferRoutes);

router.post(
  "/create",
  authMiddleware(role.company),
  warehouseController.createWarehouse
);

router.get(
  "/all",
  authMiddleware(role.company),
  warehouseController.getAllWarehouse
);

router.get(
  "/single/:id",
  authMiddleware(role.company),
  warehouseController.getSingleWarehouse
);

router.patch(
  "/edit/:id",
  authMiddleware(role.company),
  warehouseController.updateWarehouse
);

router.delete(
  "/delete/:id",
  authMiddleware(role.company),
  warehouseController.deleteWarehouse
);

export const warehouseRoutes = router;
