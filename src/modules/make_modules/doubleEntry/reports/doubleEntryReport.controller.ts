import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { ChartOfAccountModel } from "../../account/chartOfAccount/chartOfAccount.model";
import { companyScope } from "../../account/account.utils";
import * as reportService from "./doubleEntryReport.service";

const index = catchAsync(async (req: AuthRequest, res) => {
  const data = reportService.getReportsIndex();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Double entry reports index",
    data,
  });
});

const withAccounts = async (userId: string) =>
  ChartOfAccountModel.find({ ...companyScope(userId), is_active: true })
    .select("_id account_code account_name")
    .sort({ account_code: 1 })
    .lean();

const generalLedger = catchAsync(async (req: AuthRequest, res) => {
  const userId = req.user!._id as string;
  const accounts = await withAccounts(userId);
  const data = await reportService.getGeneralLedger(userId, {
    account_id: req.query.account_id as string | undefined,
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
  });
  const selectedAccount = req.query.account_id
    ? accounts.find((a) => String(a._id) === String(req.query.account_id))
    : accounts[0];
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "General ledger retrieved successfully",
    data: {
      ledger: data,
      accounts,
      selectedAccount,
      financialYear: reportService.getReportsIndex().financial_year,
    },
  });
});

const printGeneralLedger = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getGeneralLedger(req.user!._id as string, {
    account_id: req.query.account_id as string | undefined,
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "General ledger print data",
    data: { ...data, print: true, filters: req.query },
  });
});

const accountStatement = catchAsync(async (req: AuthRequest, res) => {
  const userId = req.user!._id as string;
  const accounts = await withAccounts(userId);
  const data = await reportService.getGeneralLedger(userId, {
    account_id: req.query.account_id as string | undefined,
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account statement retrieved successfully",
    data: {
      statement: data,
      accounts,
      financialYear: reportService.getReportsIndex().financial_year,
    },
  });
});

const printAccountStatement = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getGeneralLedger(req.user!._id as string, {
    account_id: req.query.account_id as string | undefined,
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account statement print data",
    data: { ...data, print: true, filters: req.query },
  });
});

const journalEntry = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getJournalEntriesReport(req.user!._id as string, {
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
    status: req.query.status as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Journal entry report retrieved successfully",
    data,
  });
});

const printJournalEntry = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getJournalEntriesReport(req.user!._id as string, {
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
    status: req.query.status as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Journal entry print data",
    data: { ...data, print: true },
  });
});

const accountBalance = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getAccountBalances(req.user!._id as string, {
    as_of_date: req.query.as_of_date as string | undefined,
    account_type: req.query.account_type as string | undefined,
    show_zero_balances: req.query.show_zero_balances === "true",
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account balance report retrieved successfully",
    data,
  });
});

const printAccountBalance = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getAccountBalances(req.user!._id as string, {
    as_of_date: req.query.as_of_date as string | undefined,
    account_type: req.query.account_type as string | undefined,
    show_zero_balances: req.query.show_zero_balances === "true",
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account balance print data",
    data: { ...data, print: true },
  });
});

const cashFlow = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getCashFlow(req.user!._id as string, {
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cash flow report retrieved successfully",
    data,
  });
});

const printCashFlow = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getCashFlow(req.user!._id as string, {
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cash flow print data",
    data: { ...data, print: true },
  });
});

const expenseReport = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getExpenseReport(req.user!._id as string, {
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Expense report retrieved successfully",
    data,
  });
});

const printExpenseReport = catchAsync(async (req: AuthRequest, res) => {
  const data = await reportService.getExpenseReport(req.user!._id as string, {
    from_date: req.query.from_date as string | undefined,
    to_date: req.query.to_date as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Expense report print data",
    data: { ...data, print: true },
  });
});

export const doubleEntryReportController = {
  index,
  generalLedger,
  printGeneralLedger,
  accountStatement,
  printAccountStatement,
  journalEntry,
  printJournalEntry,
  accountBalance,
  printAccountBalance,
  cashFlow,
  printCashFlow,
  expenseReport,
  printExpenseReport,
};
