import express from "express";

import { ServiceController } from "./service.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";

const router = express.Router();
router.post("/create", authMiddleware(role.user), ServiceController.createService);
router.get("/all", authMiddleware(role.user), ServiceController.getAllService);
router.get("/:id", authMiddleware(role.user), ServiceController.getSingleService);
router.patch("/:id", authMiddleware(role.user), ServiceController.updateService);
router.delete("/:id", authMiddleware(role.user), ServiceController.deleteService);


export const serviceRoutes = router;