import express from "express";
import { TermsController } from "./terms.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";

const router = express.Router();

router.post("/", authMiddleware(role.superadmin), TermsController.createTerms);
router.get("/", authMiddleware(role.company), TermsController.getTerms);
router.patch("/", authMiddleware(role.superadmin), TermsController.updateTerms);
router.delete("/", authMiddleware(role.superadmin), TermsController.deleteTerms);

export const TermsRoutes = router;
