import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { budgetAllocationController } from "./budgetAllocation.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), budgetAllocationController.getAll);
router.post("/", authMiddleware(role.company), budgetAllocationController.create);
router.put("/:id", authMiddleware(role.company), budgetAllocationController.update);
router.delete("/:id", authMiddleware(role.company), budgetAllocationController.remove);

export const budgetAllocationRoutes = router;
