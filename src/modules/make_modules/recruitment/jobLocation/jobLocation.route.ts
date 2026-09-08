import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { jobLocationController } from "./jobLocation.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.job_locations;

router.post("/create", auth, permissionMiddleware(P.create_job_locations), jobLocationController.create);
router.get("/all", auth, permissionMiddleware(P.manage_job_locations), jobLocationController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_job_locations), jobLocationController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_job_locations), jobLocationController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_job_locations), jobLocationController.remove);

export const jobLocationRoutes = router;
