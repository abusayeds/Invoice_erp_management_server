import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { payrollController, setSalaryController, salaryComponentsController } from "./payroll.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);

router.get("/set-salary", auth, setSalaryController.list);
router.get("/set-salary/:employeeId", auth, setSalaryController.get);
router.put("/set-salary/:employeeId", auth, setSalaryController.update);
router.post("/set-salary/:employeeId/allowances", auth, salaryComponentsController.createAllowance);
router.put("/allowances/:id", auth, salaryComponentsController.updateAllowance);
router.delete("/allowances/:id", auth, salaryComponentsController.deleteAllowance);
router.post("/set-salary/:employeeId/deductions", auth, salaryComponentsController.createDeduction);
router.put("/deductions/:id", auth, salaryComponentsController.updateDeduction);
router.delete("/set-salary/:employeeId/deductions/:id", auth, salaryComponentsController.deleteDeduction);
router.post("/set-salary/:employeeId/loans", auth, salaryComponentsController.createLoan);
router.put("/loans/:id", auth, salaryComponentsController.updateLoan);
router.delete("/set-salary/:employeeId/loans/:id", auth, salaryComponentsController.deleteLoan);
router.post("/set-salary/:employeeId/overtimes", auth, salaryComponentsController.createOvertime);
router.put("/overtimes/:id", auth, salaryComponentsController.updateOvertime);
router.delete("/set-salary/:employeeId/overtimes/:id", auth, salaryComponentsController.deleteOvertime);

router.get("/", auth, payrollController.list);
router.post("/", auth, payrollController.create);
router.get("/entries/:entryId/print", auth, payrollController.printPayslip);
router.delete("/entries/:entryId", auth, payrollController.deleteEntry);
router.patch("/entries/:entryId/pay", auth, payrollController.payEntry);
router.put("/:id", auth, payrollController.update);
router.delete("/:id", auth, payrollController.remove);
router.get("/:id", auth, payrollController.get);
router.post("/:id/run", auth, payrollController.run);

export const payrollRoutes = router;
