import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { candidateSourceController } from "./candidateSource.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.candidate_sources;

router.post("/create", auth, permissionMiddleware(P.create_candidate_sources), candidateSourceController.create);
router.get("/all", auth, permissionMiddleware(P.manage_candidate_sources), candidateSourceController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.manage_candidate_sources), candidateSourceController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_candidate_sources), candidateSourceController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_candidate_sources), candidateSourceController.remove);

export const candidateSourceRoutes = router;
