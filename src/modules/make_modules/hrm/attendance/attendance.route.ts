import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { attendanceController } from "./attendance.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);

router.get("/", auth, attendanceController.list);
router.post("/", auth, attendanceController.create);
router.get("/clock-status", auth, attendanceController.clockStatus);
router.post("/clock-in", auth, attendanceController.clockIn);
router.post("/clock-out", auth, attendanceController.clockOut);
router.post("/clock-in-out", auth, attendanceController.clockInOut);
router.post("/history", auth, attendanceController.history);
router.put("/:id", auth, attendanceController.update);
router.delete("/:id", auth, attendanceController.remove);

export const attendanceRoutes = router;
