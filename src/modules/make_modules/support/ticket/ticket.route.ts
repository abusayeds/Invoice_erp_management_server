import express from "express";
import { ticketController } from "./ticket.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const auth = authMiddleware(role.company);

router.post("/create", auth, ticketController.create);
router.get("/all", auth, ticketController.getAll);
router.get("/:id", auth, ticketController.getSingle);
router.patch("/:id", auth, ticketController.update);
router.delete("/:id", auth, ticketController.remove);
router.patch("/:id/status", auth, ticketController.changeStatus);
router.post("/:id/note", auth, ticketController.storeNote);
router.post("/:id/reply", auth, ticketController.addReply);
router.patch("/:id/reply/:replyId", auth, ticketController.updateReply);
router.delete("/:id/reply/:replyId", auth, ticketController.deleteReply);
router.delete("/:id/attachment", auth, ticketController.deleteAttachment);

export const ticketRoutes = router;
