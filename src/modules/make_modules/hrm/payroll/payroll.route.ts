import express from "express";
import { payrollController, setSalaryController, salaryComponentsController } from "./payroll.controller";
import { hrmAuth, perm, permission } from "../shared/hrm.routeAuth";

const router = express.Router();
const hrm = permission.hrm;

router.get("/set-salary", hrmAuth, perm(hrm.set_salary.manage_set_salary), setSalaryController.list);
router.get("/set-salary/:employeeId", hrmAuth, perm(hrm.set_salary.view_set_salary), setSalaryController.get);
router.put("/set-salary/:employeeId", hrmAuth, perm(hrm.set_salary.edit_set_salary), setSalaryController.update);
router.post(
  "/set-salary/:employeeId/allowances",
  hrmAuth,
  perm(hrm.allowances.create_allowances),
  salaryComponentsController.createAllowance,
);
router.put("/allowances/:id", hrmAuth, perm(hrm.allowances.edit_allowances), salaryComponentsController.updateAllowance);
router.delete("/allowances/:id", hrmAuth, perm(hrm.allowances.delete_allowances), salaryComponentsController.deleteAllowance);
router.post(
  "/set-salary/:employeeId/deductions",
  hrmAuth,
  perm(hrm.deductions.create_deductions),
  salaryComponentsController.createDeduction,
);
router.put("/deductions/:id", hrmAuth, perm(hrm.deductions.edit_deductions), salaryComponentsController.updateDeduction);
router.delete(
  "/set-salary/:employeeId/deductions/:id",
  hrmAuth,
  perm(hrm.deductions.delete_deductions),
  salaryComponentsController.deleteDeduction,
);
router.post("/set-salary/:employeeId/loans", hrmAuth, perm(hrm.loans.create_loans), salaryComponentsController.createLoan);
router.put("/loans/:id", hrmAuth, perm(hrm.loans.edit_loans), salaryComponentsController.updateLoan);
router.delete(
  "/set-salary/:employeeId/loans/:id",
  hrmAuth,
  perm(hrm.loans.delete_loans),
  salaryComponentsController.deleteLoan,
);
router.post(
  "/set-salary/:employeeId/overtimes",
  hrmAuth,
  perm(hrm.overtimes.create_overtimes),
  salaryComponentsController.createOvertime,
);
router.put("/overtimes/:id", hrmAuth, perm(hrm.overtimes.edit_overtimes), salaryComponentsController.updateOvertime);
router.delete(
  "/set-salary/:employeeId/overtimes/:id",
  hrmAuth,
  perm(hrm.overtimes.delete_overtimes),
  salaryComponentsController.deleteOvertime,
);

router.get("/", hrmAuth, perm(hrm.payrolls.manage_payrolls), payrollController.list);
router.post("/", hrmAuth, perm(hrm.payrolls.create_payrolls), payrollController.create);
router.get("/entries/:entryId/print", hrmAuth, perm(hrm.payslip.download_payslip), payrollController.printPayslip);
router.delete("/entries/:entryId", hrmAuth, perm(hrm.payslip.delete_payslip), payrollController.deleteEntry);
router.patch("/entries/:entryId/pay", hrmAuth, perm(hrm.payslip.pay_payslip), payrollController.payEntry);
router.put("/:id", hrmAuth, perm(hrm.payrolls.edit_payrolls), payrollController.update);
router.delete("/:id", hrmAuth, perm(hrm.payrolls.delete_payrolls), payrollController.remove);
router.get("/:id", hrmAuth, perm(hrm.payrolls.view_payrolls), payrollController.get);
router.post("/:id/run", hrmAuth, perm(hrm.payrolls.run_payrolls), payrollController.run);

export const payrollRoutes = router;
