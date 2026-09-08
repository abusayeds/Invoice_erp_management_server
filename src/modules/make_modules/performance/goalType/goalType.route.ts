import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { goalTypeController } from "./goalType.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.performance.goal_type;

router.post("/create", auth, permissionMiddleware(P.create_goal_types), goalTypeController.create);
router.get("/all", auth, permissionMiddleware(P.manage_goal_types), goalTypeController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.manage_goal_types), goalTypeController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_goal_types), goalTypeController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_goal_types), goalTypeController.remove);

export const goalTypeRoutes = router;
