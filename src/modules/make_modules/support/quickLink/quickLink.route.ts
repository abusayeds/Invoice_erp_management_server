import express from "express";
import { quickLinkController } from "./quickLink.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const auth = authMiddleware(role.company);

router.post("/create", auth, quickLinkController.create);
router.get("/all", auth, quickLinkController.getAll);
router.get("/:id", auth, quickLinkController.getSingle);
router.patch("/:id", auth, quickLinkController.update);
router.delete("/:id", auth, quickLinkController.remove);

export const quickLinkRoutes = router;
