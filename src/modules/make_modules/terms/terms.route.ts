import express from "express";
import { TermsController } from "./terms.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";

const router = express.Router();

router.post("/", authMiddleware(role.admin), TermsController.createTerms);
router.get("/", authMiddleware(role.company), TermsController.getTerms);
router.patch("/", authMiddleware(role.admin), TermsController.updateTerms);
router.delete("/", authMiddleware(role.admin), TermsController.deleteTerms);

export const TermsRoutes = router;
