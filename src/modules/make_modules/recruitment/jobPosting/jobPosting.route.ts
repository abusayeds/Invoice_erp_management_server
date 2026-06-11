import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { jobPostingController } from "./jobPosting.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.job_postings;

router.post("/create", auth, permissionMiddleware(P.create_job_postings), jobPostingController.create);
router.get("/all", auth, permissionMiddleware(P.manage_job_postings), jobPostingController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_job_postings), jobPostingController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_job_postings), jobPostingController.update);
router.patch("/toggle-publish/:id", auth, permissionMiddleware(P.publish_job_postings), jobPostingController.togglePublish);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_job_postings), jobPostingController.remove);

export const jobPostingRoutes = router;
