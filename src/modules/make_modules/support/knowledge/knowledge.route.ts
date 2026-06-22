import express from "express";
import { knowledgeController } from "./knowledge.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const auth = authMiddleware(role.company);

router.post("/create", auth, knowledgeController.create);
router.get("/all", auth, knowledgeController.getAll);
router.get("/:id", auth, knowledgeController.getSingle);
router.patch("/:id", auth, knowledgeController.update);
router.delete("/:id", auth, knowledgeController.remove);

export const knowledgeRoutes = router;
