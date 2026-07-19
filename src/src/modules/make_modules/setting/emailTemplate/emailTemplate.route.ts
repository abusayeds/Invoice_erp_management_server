import express from "express";
import { emailTemplateController } from "./emailTemplate.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();

router.get("/", authMiddleware(role.company), emailTemplateController.getEmailTemplate);
router.patch("/", authMiddleware(role.company), emailTemplateController.updateEmailTemplate);

export const emailTemplateRoutes = router;
