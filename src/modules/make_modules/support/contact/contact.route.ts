import express from "express";
import { contactController } from "./contact.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const auth = authMiddleware(role.company);

router.get("/all", auth, contactController.getAll);
router.get("/:id", auth, contactController.getSingle);
router.delete("/:id", auth, contactController.remove);

export const contactRoutes = router;
