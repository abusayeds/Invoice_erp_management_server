import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { transferController } from "./transfer.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.company),
  transferController.createTransfer
);

router.get(
  "/all",
  authMiddleware(role.company),
  transferController.getAllTransfer
);

router.get(
  "/single/:id",
  authMiddleware(role.company),
  transferController.getSingleTransfer
);

export const transferRoutes = router;
