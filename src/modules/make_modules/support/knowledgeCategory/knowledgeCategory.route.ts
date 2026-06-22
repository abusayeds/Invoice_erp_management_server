import express from "express";
import { knowledgeCategoryController } from "./knowledgeCategory.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const auth = authMiddleware(role.company);

router.post("/create", auth, knowledgeCategoryController.create);
router.get("/all", auth, knowledgeCategoryController.getAll);
router.get("/:id", auth, knowledgeCategoryController.getSingle);
router.patch("/:id", auth, knowledgeCategoryController.update);
router.delete("/:id", auth, knowledgeCategoryController.remove);

export const knowledgeCategoryRoutes = router;
