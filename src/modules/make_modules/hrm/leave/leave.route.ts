import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { leaveController } from "./leave.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);

router.get("/types", auth, leaveController.types);
router.get("/balance", auth, leaveController.balanceIndex);
router.get("/balance/:employeeId/:leaveTypeId", auth, leaveController.balance);
router.get("/types-by-employee/:employeeId", auth, leaveController.typesByEmployee);
router.get("/", auth, leaveController.list);
router.post("/", auth, leaveController.create);
router.put("/:id/status", auth, leaveController.updateStatus);
router.put("/:id", auth, leaveController.update);
router.delete("/:id", auth, leaveController.remove);

export const leaveRoutes = router;
