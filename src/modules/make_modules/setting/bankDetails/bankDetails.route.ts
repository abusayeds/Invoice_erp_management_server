import express from "express";
import { bankDetailsController } from "./bankDetails.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();

router.get("/", authMiddleware(role.company), bankDetailsController.getBankDetails);
router.patch("/", authMiddleware(role.company), bankDetailsController.updateBankDetails);

export const bankDetailsRoutes = router;
