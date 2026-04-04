
import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { statusController } from "./status.controller";

const router = express.Router();
router.get("/" , authMiddleware(role.user), statusController.getStatusData);
export const statusRoutes = router;