import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { trainingTypeController } from "./trainingType.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.training.training;

router.post("/create", auth, permissionMiddleware(P.create_training_types), trainingTypeController.create);
router.get("/all", auth, permissionMiddleware(P.manage_training_types), trainingTypeController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.manage_training_types), trainingTypeController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_training_types), trainingTypeController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_training_types), trainingTypeController.remove);

export const trainingTypeRoutes = router;
