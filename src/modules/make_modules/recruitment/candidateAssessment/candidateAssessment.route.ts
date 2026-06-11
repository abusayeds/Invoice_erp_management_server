import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { candidateAssessmentController } from "./candidateAssessment.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.candidate_assessments;

router.post("/create", auth, permissionMiddleware(P.create_candidate_assessments), candidateAssessmentController.create);
router.get("/all", auth, permissionMiddleware(P.manage_candidate_assessments), candidateAssessmentController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_candidate_assessments), candidateAssessmentController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_candidate_assessments), candidateAssessmentController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_candidate_assessments), candidateAssessmentController.remove);

export const candidateAssessmentRoutes = router;
