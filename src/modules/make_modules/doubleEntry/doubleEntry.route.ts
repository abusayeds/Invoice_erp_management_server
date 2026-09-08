import express from "express";
import { balanceSheetRoutes } from "./balanceSheet/balanceSheet.route";
import { ledgerSummaryRoutes } from "./ledgerSummary/ledgerSummary.route";
import { profitLossRoutes } from "./profitLoss/profitLoss.route";
import { trialBalanceRoutes } from "./trialBalance/trialBalance.route";
import { doubleEntryReportRoutes } from "./reports/doubleEntryReport.route";

const router = express.Router();

router.use("/balance-sheets", balanceSheetRoutes);
router.use("/ledger-summary", ledgerSummaryRoutes);
router.use("/profit-loss", profitLossRoutes);
router.use("/trial-balance", trialBalanceRoutes);
router.use("/reports", doubleEntryReportRoutes);

export const doubleEntryRoutes = router;
