import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { bankTransactionController } from "./bankTransaction.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), bankTransactionController.getAll);
router.post(
  "/mark-reconciled/:id",
  authMiddleware(role.company),
  bankTransactionController.markReconciled
);

export const bankTransactionRoutes = router;
