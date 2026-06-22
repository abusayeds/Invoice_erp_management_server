import express from "express";
import { ticketFieldController } from "./ticketField.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const auth = authMiddleware(role.company);

router.post("/create", auth, ticketFieldController.create);
router.get("/all", auth, ticketFieldController.getAll);
router.get("/:id", auth, ticketFieldController.getSingle);
router.patch("/:id", auth, ticketFieldController.update);
router.delete("/:id", auth, ticketFieldController.remove);

export const ticketFieldRoutes = router;
