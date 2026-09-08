import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { trainingFeedbackController } from "./trainingFeedback.controller";

// Nested under a task: /tasks/:taskId/feedbacks (list + create only — Laravel has no edit/delete).
const router = express.Router({ mergeParams: true });
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.training.training;

router.post("/create", auth, permissionMiddleware(P.create_training_feedbacks), trainingFeedbackController.create);
router.get("/all", auth, permissionMiddleware(P.manage_training_feedbacks), trainingFeedbackController.getAll);

export const trainingFeedbackRoutes = router;
