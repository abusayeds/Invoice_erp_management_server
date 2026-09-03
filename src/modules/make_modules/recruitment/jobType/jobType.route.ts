import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { jobTypeController } from "./jobType.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.job_types;

router.post("/create", auth, permissionMiddleware(P.create_job_types), jobTypeController.create);
router.get("/all", auth, permissionMiddleware(P.manage_job_types), jobTypeController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.manage_job_types), jobTypeController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_job_types), jobTypeController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_job_types), jobTypeController.remove);

export const jobTypeRoutes = router;
