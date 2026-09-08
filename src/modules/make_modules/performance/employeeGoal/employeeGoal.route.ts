import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { employeeGoalController } from "./employeeGoal.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.performance.employee_goal;

router.post("/create", auth, permissionMiddleware(P.create_employee_goals), employeeGoalController.create);
router.get("/all", auth, permissionMiddleware(P.manage_employee_goals), employeeGoalController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_employee_goals), employeeGoalController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_employee_goals), employeeGoalController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_employee_goals), employeeGoalController.remove);

export const employeeGoalRoutes = router;
