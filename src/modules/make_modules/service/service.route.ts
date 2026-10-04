import express from "express";

import { ServiceController } from "./service.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";

const router = express.Router();
router.post("/create", authMiddleware(role.company), ServiceController.createService);
router.post("/merge", authMiddleware(role.company), ServiceController.mergeServices);
router.get("/all", authMiddleware(role.company), ServiceController.getAllService);
// Permanent delete from Trash — new, additive endpoint. Registered BEFORE the
// `/:id` routes so Express doesn't swallow it as a GET on an id named "hard-delete".
router.delete("/hard-delete/:id", authMiddleware(role.company), ServiceController.hardDeleteService);
router.get("/:id", authMiddleware(role.company), ServiceController.getSingleService);
router.patch("/:id", authMiddleware(role.company), ServiceController.updateService);
router.delete("/:id", authMiddleware(role.company), ServiceController.deleteService);


export const serviceRoutes = router;