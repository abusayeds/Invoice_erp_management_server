import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { bankTransferController } from "./bankTransfer.controller";

const router = express.Router();

router.get("/all", authMiddleware(role.company), bankTransferController.getAll);
router.post("/create", authMiddleware(role.company), bankTransferController.create);
router.patch("/edit/:id", authMiddleware(role.company), bankTransferController.update);
router.delete("/delete/:id", authMiddleware(role.company), bankTransferController.remove);
router.post("/process/:id", authMiddleware(role.company), bankTransferController.process);

export const bankTransferRoutes = router;
