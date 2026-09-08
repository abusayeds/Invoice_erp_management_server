import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { candidateController } from "./candidate.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.candidates;

router.post("/create", auth, permissionMiddleware(P.create_candidates), candidateController.create);
router.get("/all", auth, permissionMiddleware(P.manage_candidates), candidateController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_candidates), candidateController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_candidates), candidateController.update);
router.patch("/update-status/:id", auth, permissionMiddleware(P.edit_candidates), candidateController.updateStatus);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_candidates), candidateController.remove);

export const candidateRoutes = router;
