import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { interviewRoundController } from "./interviewRound.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.interview_rounds;

router.post("/create", auth, permissionMiddleware(P.create_interview_rounds), interviewRoundController.create);
router.get("/all", auth, permissionMiddleware(P.manage_interview_rounds), interviewRoundController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_interview_rounds), interviewRoundController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_interview_rounds), interviewRoundController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_interview_rounds), interviewRoundController.remove);

export const interviewRoundRoutes = router;
