import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { accountCreditNoteController } from "./accountCreditNote.controller";

const router = express.Router();

router.post("/create", authMiddleware(role.company), accountCreditNoteController.create);
router.get("/all", authMiddleware(role.company), accountCreditNoteController.getAll);
router.get("/single/:id", authMiddleware(role.company), accountCreditNoteController.getSingle);
router.post("/approve/:id", authMiddleware(role.company), accountCreditNoteController.approve);
router.delete("/delete/:id", authMiddleware(role.company), accountCreditNoteController.remove);

export const accountCreditNoteRoutes = router;
