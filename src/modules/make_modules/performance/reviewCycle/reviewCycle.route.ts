import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { reviewCycleController } from "./reviewCycle.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.performance.review_cycle;

router.post("/create", auth, permissionMiddleware(P.create_review_cycles), reviewCycleController.create);
router.get("/all", auth, permissionMiddleware(P.manage_review_cycles), reviewCycleController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_review_cycles), reviewCycleController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_review_cycles), reviewCycleController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_review_cycles), reviewCycleController.remove);

export const reviewCycleRoutes = router;
