import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { interviewTypeController } from "./interviewType.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.interview_types;

router.post("/create", auth, permissionMiddleware(P.create_interview_types), interviewTypeController.create);
router.get("/all", auth, permissionMiddleware(P.manage_interview_types), interviewTypeController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.manage_interview_types), interviewTypeController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_interview_types), interviewTypeController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_interview_types), interviewTypeController.remove);

export const interviewTypeRoutes = router;
