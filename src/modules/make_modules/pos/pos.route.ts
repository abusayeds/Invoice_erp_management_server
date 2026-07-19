import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { posController } from "./pos.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.staff, role.customer);

router.get("/dashboard", auth, posController.getDashboard);

export const posRoutes = router;
