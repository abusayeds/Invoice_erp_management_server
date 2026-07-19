import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { trainingController } from "./training.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.training.training;

router.post("/create", auth, permissionMiddleware(P.create_trainings), trainingController.create);
router.get("/all", auth, permissionMiddleware(P.manage_trainings), trainingController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.manage_trainings), trainingController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_trainings), trainingController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_trainings), trainingController.remove);

export const trainingMainRoutes = router;
