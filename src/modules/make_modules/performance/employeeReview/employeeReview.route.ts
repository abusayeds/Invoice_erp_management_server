import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { employeeReviewController } from "./employeeReview.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.performance.employee_review;

router.post(
  "/create",
  auth,
  permissionMiddleware(P.create_employee_reviews),
  employeeReviewController.create
);

router.get(
  "/all",
  auth,
  permissionMiddleware(P.manage_employee_reviews),
  employeeReviewController.getAll
);

// Conduct (fetch the rating form + submit ratings) — keep before "/single/:id".
router.get(
  "/conduct/:id",
  auth,
  permissionMiddleware(P.conduct_employee_reviews),
  employeeReviewController.conduct
);

router.post(
  "/conduct/:id",
  auth,
  permissionMiddleware(P.conduct_employee_reviews),
  employeeReviewController.conductStore
);

router.get(
  "/single/:id",
  auth,
  permissionMiddleware(P.view_employee_reviews),
  employeeReviewController.getSingle
);

router.patch(
  "/edit/:id",
  auth,
  permissionMiddleware(P.edit_employee_reviews),
  employeeReviewController.update
);

router.delete(
  "/delete/:id",
  auth,
  permissionMiddleware(P.delete_employee_reviews),
  employeeReviewController.remove
);

export const employeeReviewRoutes = router;
