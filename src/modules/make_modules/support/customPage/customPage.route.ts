import express from "express";
import { customPageController } from "./customPage.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const auth = authMiddleware(role.company);

router.post("/create", auth, customPageController.create);
router.get("/all", auth, customPageController.getAll);
router.get("/:id", auth, customPageController.getSingle);
router.patch("/:id", auth, customPageController.update);
router.delete("/:id", auth, customPageController.remove);

export const customPageRoutes = router;
