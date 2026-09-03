import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { payrollService, setSalaryService } from "./payroll.service";
import { salaryComponentsService } from "./salaryComponents.service";
import { sendHrmPaginatedList } from "../shared/hrm.response";

export const payrollController = {
  list: catchAsync(async (req: AuthRequest, res) => {
    const result = await payrollService.list(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, "Payrolls", result);
  }),
  create: catchAsync(async (req: AuthRequest, res) => {
    const data = await payrollService.create(req, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Payroll created", data });
  }),
  get: catchAsync(async (req: AuthRequest, res) => {
    const data = await payrollService.get(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payroll detail", data });
  }),
  run: catchAsync(async (req: AuthRequest, res) => {
    const data = await payrollService.run(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payroll processed", data });
  }),
  payEntry: catchAsync(async (req: AuthRequest, res) => {
    const data = await payrollService.payEntry(req, req.params.entryId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payslip marked paid", data });
  }),
  update: catchAsync(async (req: AuthRequest, res) => {
    const data = await payrollService.update(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payroll updated", data });
  }),
  remove: catchAsync(async (req: AuthRequest, res) => {
    const data = await payrollService.remove(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payroll deleted", data });
  }),
  deleteEntry: catchAsync(async (req: AuthRequest, res) => {
    const data = await payrollService.deleteEntry(req, req.params.entryId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payslip deleted", data });
  }),
  printPayslip: catchAsync(async (req: AuthRequest, res) => {
    const data = await payrollService.printPayslip(req, req.params.entryId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payslip data", data });
  }),
};

export const salaryComponentsController = {
  createAllowance: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.createAllowance(req, req.params.employeeId, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Allowance added", data });
  }),
  updateAllowance: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.updateAllowance(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Allowance updated", data });
  }),
  deleteAllowance: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.deleteAllowance(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Allowance removed", data });
  }),
  createDeduction: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.createDeduction(req, req.params.employeeId, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Deduction added", data });
  }),
  updateDeduction: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.updateDeduction(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Deduction updated", data });
  }),
  deleteDeduction: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.deleteDeduction(req, req.params.id, req.params.employeeId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Deduction removed", data });
  }),
  createLoan: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.createLoan(req, req.params.employeeId, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Loan added", data });
  }),
  updateLoan: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.updateLoan(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Loan updated", data });
  }),
  deleteLoan: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.deleteLoan(req, req.params.id, req.params.employeeId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Loan removed", data });
  }),
  createOvertime: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.createOvertime(req, req.params.employeeId, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Overtime added", data });
  }),
  updateOvertime: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.updateOvertime(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Overtime updated", data });
  }),
  deleteOvertime: catchAsync(async (req: AuthRequest, res) => {
    const data = await salaryComponentsService.deleteOvertime(req, req.params.id, req.params.employeeId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Overtime removed", data });
  }),
};

export const setSalaryController = {
  list: catchAsync(async (req: AuthRequest, res) => {
    const result = await setSalaryService.listEmployees(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, "Set salary list", result);
  }),
  get: catchAsync(async (req: AuthRequest, res) => {
    const data = await setSalaryService.getEmployeeSalary(req, req.params.employeeId);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Employee salary", data });
  }),
  update: catchAsync(async (req: AuthRequest, res) => {
    const data = await setSalaryService.updateEmployeeSalary(req, req.params.employeeId, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Salary updated", data });
  }),
};
