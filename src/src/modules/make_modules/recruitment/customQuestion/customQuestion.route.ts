import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { customQuestionController } from "./customQuestion.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.custom_questions;

router.post("/create", auth, permissionMiddleware(P.create_custom_questions), customQuestionController.create);
router.get("/all", auth, permissionMiddleware(P.manage_custom_questions), customQuestionController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_custom_questions), customQuestionController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_custom_questions), customQuestionController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_custom_questions), customQuestionController.remove);

export const customQuestionRoutes = router;
