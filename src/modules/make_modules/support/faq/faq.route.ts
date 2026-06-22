import express from "express";
import { faqController } from "./faq.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const auth = authMiddleware(role.company);

router.post("/create", auth, faqController.create);
router.get("/all", auth, faqController.getAll);
router.get("/:id", auth, faqController.getSingle);
router.patch("/:id", auth, faqController.update);
router.delete("/:id", auth, faqController.remove);

export const faqRoutes = router;
