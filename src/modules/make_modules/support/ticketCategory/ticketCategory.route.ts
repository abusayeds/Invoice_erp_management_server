import express from "express";
import { ticketCategoryController } from "./ticketCategory.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const auth = authMiddleware(role.company);

router.post("/create", auth, ticketCategoryController.create);
router.get("/all", auth, ticketCategoryController.getAll);
router.get("/:id", auth, ticketCategoryController.getSingle);
router.patch("/:id", auth, ticketCategoryController.update);
router.delete("/:id", auth, ticketCategoryController.remove);

export const ticketCategoryRoutes = router;
