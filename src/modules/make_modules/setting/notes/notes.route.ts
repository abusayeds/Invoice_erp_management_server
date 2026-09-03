import express from "express";
import { notesController } from "./notes.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();

router.get("/", authMiddleware(role.company), notesController.getNotes);
router.patch("/", authMiddleware(role.company), notesController.updateNotes);

export const notesRoutes = router;
