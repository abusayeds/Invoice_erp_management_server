import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { indicatorController } from "./indicator.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.performance.performance_indicator;

router.post(
  "/create",
  auth,
  permissionMiddleware(P.create_performance_indicators),
  indicatorController.create
);

router.get(
  "/all",
  auth,
  permissionMiddleware(P.manage_performance_indicators),
  indicatorController.getAll
);

router.get(
  "/single/:id",
  auth,
  permissionMiddleware(P.view_performance_indicators),
  indicatorController.getSingle
);

router.patch(
  "/edit/:id",
  auth,
  permissionMiddleware(P.edit_performance_indicators),
  indicatorController.update
);

router.delete(
  "/delete/:id",
  auth,
  permissionMiddleware(P.delete_performance_indicators),
  indicatorController.remove
);

export const indicatorRoutes = router;
