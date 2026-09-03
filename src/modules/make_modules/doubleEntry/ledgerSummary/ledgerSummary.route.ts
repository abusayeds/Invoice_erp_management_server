import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { ledgerSummaryController } from "./ledgerSummary.controller";

const router = express.Router();

router.get("/print", authMiddleware(role.company), ledgerSummaryController.print);
router.get("/", authMiddleware(role.company), ledgerSummaryController.index);

export const ledgerSummaryRoutes = router;
