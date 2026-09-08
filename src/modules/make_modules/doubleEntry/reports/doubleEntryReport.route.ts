import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { doubleEntryReportController } from "./doubleEntryReport.controller";

const router = express.Router();

router.get("/", authMiddleware(role.company), doubleEntryReportController.index);
router.get("/general-ledger/print", authMiddleware(role.company), doubleEntryReportController.printGeneralLedger);
router.get("/general-ledger", authMiddleware(role.company), doubleEntryReportController.generalLedger);
router.get(
  "/account-statement/print",
  authMiddleware(role.company),
  doubleEntryReportController.printAccountStatement
);
router.get("/account-statement", authMiddleware(role.company), doubleEntryReportController.accountStatement);
router.get("/journal-entry/print", authMiddleware(role.company), doubleEntryReportController.printJournalEntry);
router.get("/journal-entry", authMiddleware(role.company), doubleEntryReportController.journalEntry);
router.get("/account-balance/print", authMiddleware(role.company), doubleEntryReportController.printAccountBalance);
router.get("/account-balance", authMiddleware(role.company), doubleEntryReportController.accountBalance);
router.get("/cash-flow/print", authMiddleware(role.company), doubleEntryReportController.printCashFlow);
router.get("/cash-flow", authMiddleware(role.company), doubleEntryReportController.cashFlow);
router.get("/expense-report/print", authMiddleware(role.company), doubleEntryReportController.printExpenseReport);
router.get("/expense-report", authMiddleware(role.company), doubleEntryReportController.expenseReport);

export const doubleEntryReportRoutes = router;
