import express from "express";
import { leaveController } from "./leave.controller";
import { hrmAuth, perm, permission } from "../shared/hrm.routeAuth";

const router = express.Router();
const hrm = permission.hrm;

router.get("/types", hrmAuth, perm(hrm.leave_types.manage_leave_types), leaveController.types);
router.get("/balance", hrmAuth, perm(hrm.leave_balance.manage_leave_balance), leaveController.balanceIndex);
router.get(
  "/balance/all-employees",
  hrmAuth,
  perm(hrm.leave_balance.manage_leave_balance),
  leaveController.balanceAllEmployees,
);
router.get(
  "/balance/:employeeId/:leaveTypeId",
  hrmAuth,
  perm(hrm.leave_balance.manage_leave_balance),
  leaveController.balance,
);
router.get(
  "/types-by-employee/:employeeId",
  hrmAuth,
  perm(hrm.leave_applications.create_leave_applications, hrm.leave_applications.view_leave_applications),
  leaveController.typesByEmployee,
);
router.get("/", hrmAuth, perm(hrm.leave_applications.manage_leave_applications), leaveController.list);
router.post("/", hrmAuth, perm(hrm.leave_applications.create_leave_applications), leaveController.create);
router.put("/:id/status", hrmAuth, perm(hrm.leave_applications.manage_leave_status), leaveController.updateStatus);
router.put("/:id", hrmAuth, perm(hrm.leave_applications.edit_leave_applications), leaveController.update);
router.delete("/:id", hrmAuth, perm(hrm.leave_applications.delete_leave_applications), leaveController.remove);

export const leaveRoutes = router;
