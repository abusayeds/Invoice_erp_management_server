import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { candidateOnboardingController } from "./candidateOnboarding.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.candidate_onboardings;

router.post("/create", auth, permissionMiddleware(P.create_candidate_onboardings), candidateOnboardingController.create);
router.get("/all", auth, permissionMiddleware(P.manage_candidate_onboardings), candidateOnboardingController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_candidate_onboardings), candidateOnboardingController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_candidate_onboardings), candidateOnboardingController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_candidate_onboardings), candidateOnboardingController.remove);

export const candidateOnboardingRoutes = router;
