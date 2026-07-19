import { ChartOfAccountModel } from "../../account/chartOfAccount/chartOfAccount.model";
import { companyScope } from "../../account/account.utils";
import {
  getAccountBalanceInPeriod,
  parseReportDateRange,
} from "../../account/ledger/ledger.service";

export const generateProfitLoss = async (
  userId: string,
  fromDateStr?: string,
  toDateStr?: string
) => {
  const { from: fromDate, to: toDate, fromStr, toStr } = parseReportDateRange(
    fromDateStr,
    toDateStr
  );

  const accounts = await ChartOfAccountModel.find({
    ...companyScope(userId),
    is_active: true,
    account_code: { $gte: "4000", $lte: "5999" },
  })
    .sort({ account_code: 1 })
    .lean();

  const revenue: Array<Record<string, unknown>> = [];
  const expenses: Array<Record<string, unknown>> = [];
  let totalRevenue = 0;
  let totalExpenses = 0;

  for (const account of accounts) {
    const balance = await getAccountBalanceInPeriod(userId, account._id!, fromDate, toDate);
    if (Math.abs(balance) <= 0.01) continue;
    const code = parseInt(account.account_code, 10);
    const row = {
      _id: account._id,
      account_code: account.account_code,
      account_name: account.account_name,
      balance,
    };
    if (code >= 4000 && code <= 4999) {
      revenue.push(row);
      totalRevenue += balance;
    } else if (code >= 5000 && code <= 5999) {
      expenses.push(row);
      totalExpenses += balance;
    }
  }

  return {
    revenue,
    expenses,
    total_revenue: totalRevenue,
    total_expenses: totalExpenses,
    net_profit: totalRevenue - totalExpenses,
    from_date: fromStr,
    to_date: toStr,
  };
};
