import express from "express";
import { signatureController } from "./signature.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();

router.post("/create", authMiddleware(role.company), signatureController.createSignature);
router.get("/all", authMiddleware(role.company), signatureController.getAllSignature);
router.get("/:id", authMiddleware(role.company), signatureController.getSingleSignature);
router.patch("/:id", authMiddleware(role.company), signatureController.updateSignature);
router.delete("/:id", authMiddleware(role.company), signatureController.deleteSignature);

export const signatureRoutes = router;
