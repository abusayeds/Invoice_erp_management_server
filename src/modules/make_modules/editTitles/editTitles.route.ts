import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { editTitleController } from "./editTitles.controller";

const router = express.Router();

router.patch("/update",authMiddleware(role.company), editTitleController.editTitlesUpdate);
router.get("/single/:id",authMiddleware(role.company),editTitleController.singleEditTitles);
router.get("/my",authMiddleware(role.company),editTitleController.myEditTitles);


export const EditTitlesRoutes = router;