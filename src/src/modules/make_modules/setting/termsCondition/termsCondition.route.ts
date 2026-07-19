import express from "express";
import { termsConditionController } from "./termsCondition.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();

router.get("/", authMiddleware(role.company), termsConditionController.getTermsCondition);
router.patch("/", authMiddleware(role.company), termsConditionController.updateTermsCondition);

export const termsConditionRoutes = router;
