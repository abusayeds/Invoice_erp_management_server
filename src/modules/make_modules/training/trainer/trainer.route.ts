import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { trainerController } from "./trainer.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.training.training;

router.post("/create", auth, permissionMiddleware(P.create_trainers), trainerController.create);
router.get("/all", auth, permissionMiddleware(P.manage_trainers), trainerController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.manage_trainers), trainerController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_trainers), trainerController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_trainers), trainerController.remove);

export const trainerRoutes = router;
