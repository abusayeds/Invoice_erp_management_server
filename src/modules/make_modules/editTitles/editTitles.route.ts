import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { editTitleController } from "./editTitles.controller";

const router = express.Router();

router.patch("/update",authMiddleware(role.user), editTitleController.editTitlesUpdate);
router.get("/single/:id",authMiddleware(role.user),editTitleController.singleEditTitles);
router.get("/my",authMiddleware(role.user),editTitleController.myEditTitles);


export const EditTitlesRoutes = router;