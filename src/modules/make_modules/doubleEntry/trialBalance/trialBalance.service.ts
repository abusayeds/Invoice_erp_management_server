import { ChartOfAccountModel } from "../../account/chartOfAccount/chartOfAccount.model";
import { companyScope } from "../../account/account.utils";
import {
  getAccountBalanceInPeriod,
  parseReportDateRange,
} from "../../account/ledger/ledger.service";

export const generateTrialBalance = async (
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
  })
    .sort({ account_code: 1 })
    .lean();

  const accountsList: Array<{
    _id: string;
    account_code: string;
    account_name: string;
    debit: number;
    credit: number;
  }> = [];
  let totalDebit = 0;
  let totalCredit = 0;

  for (const account of accounts) {
    const balance = await getAccountBalanceInPeriod(userId, account._id!, fromDate, toDate);
    if (Math.abs(balance) <= 0.01) continue;

    let debit = 0;
    let credit = 0;
    if (balance > 0) {
      if (account.normal_balance === "debit") {
        debit = balance;
        totalDebit += debit;
      } else {
        credit = balance;
        totalCredit += credit;
      }
    } else {
      const abs = Math.abs(balance);
      if (account.normal_balance === "debit") {
        credit = abs;
        totalCredit += credit;
      } else {
        debit = abs;
        totalDebit += debit;
      }
    }

    accountsList.push({
      _id: String(account._id),
      account_code: account.account_code,
      account_name: account.account_name,
      debit: Math.round(debit * 100) / 100,
      credit: Math.round(credit * 100) / 100,
    });
  }

  return {
    accounts: accountsList,
    total_debit: Math.round(totalDebit * 100) / 100,
    total_credit: Math.round(totalCredit * 100) / 100,
    is_balanced: Math.abs(totalDebit - totalCredit) < 0.01,
    from_date: fromStr,
    to_date: toStr,
  };
};
