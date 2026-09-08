import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { masterRoutes } from "./master/master.route";
import { employeeRoutes } from "./employee/employee.route";
import { leaveRoutes } from "./leave/leave.route";
import { attendanceRoutes } from "./attendance/attendance.route";
import { workflowRoutes } from "./workflow/workflow.route";
import { payrollRoutes } from "./payroll/payroll.route";
import { dashboardController, mobileController } from "./dashboard/dashboard.controller";
import { hrmLookupsController } from "./lookups/lookups.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);

router.get("/dashboard", auth, dashboardController.home);
router.get("/dashboard/event-calendar", auth, dashboardController.eventCalendar);

router.get("/mobile/home", auth, mobileController.home);
router.post("/mobile/events", auth, mobileController.events);
router.get("/mobile/holidays-list", auth, mobileController.holidaysList);
router.post("/mobile/attendance-history", auth, mobileController.attendanceHistory);
router.post("/mobile/clock-in-out", auth, mobileController.clockInOut);
router.get("/mobile/leaves", auth, mobileController.getLeaves);
router.post("/mobile/leave-request", auth, mobileController.leaveRequest);
router.get("/mobile/leave-types", auth, mobileController.leaveTypes);

router.get("/users/:employeeUserId/warning-bies", auth, hrmLookupsController.warningBies);
router.get("/users/:warningById/warning-types", auth, hrmLookupsController.warningTypes);
router.get("/event-types/:eventTypeId/approved-bies", auth, hrmLookupsController.approvedBies);
router.get("/employees/:employeeId/shifts", auth, hrmLookupsController.shiftsByEmployee);

router.use("/setup", masterRoutes);
router.use("/employees", employeeRoutes);
router.use("/leave", leaveRoutes);
router.use("/attendances", attendanceRoutes);
router.use("/", workflowRoutes);
router.use("/payroll", payrollRoutes);

export const hrmRoutes = router;
