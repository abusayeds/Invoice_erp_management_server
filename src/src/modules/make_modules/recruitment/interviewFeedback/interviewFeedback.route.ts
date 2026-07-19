import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { interviewFeedbackController } from "./interviewFeedback.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.interview_feedbacks;

router.post("/create", auth, permissionMiddleware(P.create_interview_feedbacks), interviewFeedbackController.create);
router.get("/all", auth, permissionMiddleware(P.manage_interview_feedbacks), interviewFeedbackController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_interview_feedbacks), interviewFeedbackController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_interview_feedbacks), interviewFeedbackController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_interview_feedbacks), interviewFeedbackController.remove);

export const interviewFeedbackRoutes = router;
