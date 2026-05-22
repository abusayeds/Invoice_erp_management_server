import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { returnPurchaseController } from "./returnPurchase.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.company),
  returnPurchaseController.createReturn
);

router.get(
  "/all",
  authMiddleware(role.company),
  returnPurchaseController.getAllReturn
);

router.get(
  "/single/:id",
  authMiddleware(role.company),
  returnPurchaseController.getSingleReturn
);

router.post(
  "/approve/:id",
  authMiddleware(role.company),
  returnPurchaseController.approveReturn
);

router.patch(
  "/edit/:id",
  authMiddleware(role.company),
  returnPurchaseController.updateReturn
);

router.delete(
  "/delete/:id",
  authMiddleware(role.company),
  returnPurchaseController.deleteReturn
);

export const returnPurchaseRoutes = router;
