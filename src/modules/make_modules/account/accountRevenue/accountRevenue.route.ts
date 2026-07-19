import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { accountRevenueController } from "./accountRevenue.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), accountRevenueController.getAll);
router.post("/create", authMiddleware(role.company), accountRevenueController.create);
router.patch("/edit/:id", authMiddleware(role.company), accountRevenueController.update);
router.delete("/delete/:id", authMiddleware(role.company), accountRevenueController.remove);
router.post("/approve/:id", authMiddleware(role.company), accountRevenueController.approve);
router.post("/post/:id", authMiddleware(role.company), accountRevenueController.post);

export const accountRevenueRoutes = router;
