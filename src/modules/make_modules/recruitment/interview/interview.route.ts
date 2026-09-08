import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { interviewController } from "./interview.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.interviews;

router.post("/create", auth, permissionMiddleware(P.create_interviews), interviewController.create);
router.get("/all", auth, permissionMiddleware(P.manage_interviews), interviewController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_interviews), interviewController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_interviews), interviewController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_interviews), interviewController.remove);

export const interviewRoutes = router;
