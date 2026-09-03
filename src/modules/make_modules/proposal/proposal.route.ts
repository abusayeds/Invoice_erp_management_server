import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { proposalController } from "./proposal.controller";

const router = express.Router();

router.post("/create", authMiddleware(role.company), proposalController.create);

router.get("/single/:id", authMiddleware(role.company), proposalController.getSingle);

router.get("/all", authMiddleware(role.company), proposalController.getAll);

router.patch("/edit/:id", authMiddleware(role.company), proposalController.update);

router.delete("/delete/:id", authMiddleware(role.company), proposalController.remove);

export const proposalRoutes = router;
