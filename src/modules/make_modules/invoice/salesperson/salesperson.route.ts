import express from "express";
import { salespersonController } from "./salesperson.controller";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();

router.post("/create", authMiddleware(role.company), salespersonController.createSalesperson);
router.get("/all", authMiddleware(role.company), salespersonController.getAllSalesperson);
router.get("/:id", authMiddleware(role.company), salespersonController.getSingleSalesperson);
router.patch("/:id", authMiddleware(role.company), salespersonController.updateSalesperson);
router.delete("/:id", authMiddleware(role.company), salespersonController.deleteSalesperson);

export const salespersonRoutes = router;
