import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { onboardingChecklistController } from "./onboardingChecklist.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.onboarding_checklists;

router.post("/create", auth, permissionMiddleware(P.create_onboarding_checklists), onboardingChecklistController.create);
router.get("/all", auth, permissionMiddleware(P.manage_onboarding_checklists), onboardingChecklistController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_onboarding_checklists), onboardingChecklistController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_onboarding_checklists), onboardingChecklistController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_onboarding_checklists), onboardingChecklistController.remove);

export const onboardingChecklistRoutes = router;
