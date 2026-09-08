import { PipelineStage, Types } from "mongoose";
import { ChartOfAccountModel } from "../../account/chartOfAccount/chartOfAccount.model";
import { companyScope, companyObjectId } from "../../account/account.utils";
import {
  getAccountBalance,
  getAccountTypeLabel,
  getPeriodMovementBalance,
  parseReportDateRange,
} from "../../account/ledger/ledger.service";
import { JournalEntryModel } from "../../account/journal/journalEntry.model";
import { JournalEntryItemModel } from "../../account/journal/journalEntryItem.model";

const defaultYearRange = () => {
  const y = new Date().getFullYear();
  return { from: `${y}-01-01`, to: `${y}-12-31`, asOf: `${y}-12-31` };
};

export const getReportsIndex = () => {
  const y = new Date().getFullYear();
  return {
    financial_year: {
      year_start_date: `${y}-01-01`,
      year_end_date: `${y}-12-31`,
    },
  };
};

export const getGeneralLedger = async (
  userId: string,
  filters: { account_id?: string; from_date?: string; to_date?: string }
) => {
  if (!filters.account_id) return null;

  const accountId = new Types.ObjectId(filters.account_id);
  const fromDate = filters.from_date ? new Date(filters.from_date) : undefined;
  const toDate = filters.to_date ? new Date(filters.to_date) : undefined;

  let opening_balance = 0;
  if (fromDate) {
    opening_balance = await getAccountBalance(userId, accountId, { asOfDate: fromDate });
    const dayBefore = new Date(fromDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    opening_balance = await getAccountBalance(userId, accountId, { asOfDate: dayBefore });
  }

  const userOid = companyObjectId(userId);
  const pipeline: PipelineStage[] = [
    { $match: { user_id: userOid, account_id: accountId, isDeleted: false } },
    {
      $lookup: {
        from: "journalentries",
        localField: "journal_entry_id",
        foreignField: "_id",
        as: "journal",
      },
    },
    { $unwind: "$journal" },
    {
      $match: {
        "journal.status": "posted",
        "journal.isDeleted": false,
        ...(fromDate || toDate
          ? {
              "journal.journal_date": {
                ...(fromDate ? { $gte: fromDate } : {}),
                ...(toDate ? { $lte: toDate } : {}),
              },
            }
          : {}),
      },
    },
    { $sort: { "journal.journal_date": 1, _id: 1 } },
  ];

  const items = await JournalEntryItemModel.aggregate([
    ...pipeline,
    {
      $lookup: {
        from: "accountchartofaccounts",
        localField: "account_id",
        foreignField: "_id",
        as: "account",
      },
    },
    { $unwind: "$account" },
    {
      $project: {
        journal_date: "$journal.journal_date",
        reference_type: "$journal.reference_type",
        reference_id: "$journal.reference_id",
        description: 1,
        debit_amount: 1,
        credit_amount: 1,
        account_code: "$account.account_code",
        account_name: "$account.account_name",
      },
    },
  ]);

  let running = opening_balance;
  const transactions = items.map((entry) => {
    running += (entry.debit_amount ?? 0) - (entry.credit_amount ?? 0);
    return {
      _id: entry._id,
      date: entry.journal_date,
      account_code: entry.account_code,
      account_name: entry.account_name,
      description: entry.description,
      reference_type: entry.reference_type,
      reference_id: entry.reference_id,
      debit: entry.debit_amount,
      credit: entry.credit_amount,
      balance: running,
    };
  });

  return {
    opening_balance,
    transactions,
    closing_balance: running,
  };
};

export const getJournalEntriesReport = async (
  userId: string,
  filters: { from_date?: string; to_date?: string; status?: string }
) => {
  const defaults = defaultYearRange();
  const match: Record<string, unknown> = { ...companyScope(userId) };
  if (filters.status) match.status = filters.status;
  if (filters.from_date || filters.to_date) {
    const { from, to } = parseReportDateRange(filters.from_date, filters.to_date);
    match.journal_date = { $gte: from, $lte: to };
  }

  const entries = await JournalEntryModel.find(match).sort({ journal_date: -1 }).lean();
  const result = [];

  for (const entry of entries) {
    const items = await JournalEntryItemModel.find({
      journal_entry_id: entry._id,
      ...companyScope(userId),
      isDeleted: false,
    })
      .populate("account_id", "account_code account_name")
      .lean();

    const totalDebit = items.reduce((s, i) => s + (i.debit_amount ?? 0), 0);
    const totalCredit = items.reduce((s, i) => s + (i.credit_amount ?? 0), 0);

    result.push({
      _id: entry._id,
      journal_number: entry.journal_number,
      date: entry.journal_date,
      reference_type: entry.reference_type,
      description: entry.description,
      total_debit: totalDebit,
      total_credit: totalCredit,
      status: entry.status,
      is_balanced: Math.abs(totalDebit - totalCredit) < 0.01,
      items: items.map((item) => ({
        account_code: (item.account_id as { account_code?: string })?.account_code ?? "",
        account_name: (item.account_id as { account_name?: string })?.account_name ?? "",
        description: item.description,
        debit: item.debit_amount,
        credit: item.credit_amount,
      })),
    });
  }

  return {
    entries: result,
    from_date: filters.from_date ?? defaults.from,
    to_date: filters.to_date ?? defaults.to,
    status: filters.status ?? null,
  };
};

export const getAccountBalances = async (
  userId: string,
  filters: { as_of_date?: string; account_type?: string; show_zero_balances?: boolean }
) => {
  const defaults = defaultYearRange();
  const asOfDate = new Date(filters.as_of_date ?? defaults.asOf);
  const showZero = filters.show_zero_balances === true;

  const accounts = await ChartOfAccountModel.find({
    ...companyScope(userId),
    is_active: true,
  })
    .sort({ account_code: 1 })
    .lean();

  const grouped: Record<
    string,
    {
      accounts: Array<Record<string, unknown>>;
      subtotal_debit: number;
      subtotal_credit: number;
      subtotal_net: number;
    }
  > = {};
  const totals = { debit: 0, credit: 0, net: 0 };

  for (const account of accounts) {
    const type = getAccountTypeLabel(account.account_code);
    if (filters.account_type && filters.account_type !== type) continue;

    const balance = await getAccountBalance(userId, account._id!, { asOfDate });
    if (!showZero && Math.abs(balance) < 0.01) continue;

    const debit = balance > 0 ? balance : 0;
    const credit = balance < 0 ? Math.abs(balance) : 0;

    if (!grouped[type]) {
      grouped[type] = { accounts: [], subtotal_debit: 0, subtotal_credit: 0, subtotal_net: 0 };
    }

    grouped[type].accounts.push({
      account_code: account.account_code,
      account_name: account.account_name,
      account_type: type,
      debit,
      credit,
      net_balance: balance,
    });
    grouped[type].subtotal_debit += debit;
    grouped[type].subtotal_credit += credit;
    grouped[type].subtotal_net += balance;
    totals.debit += debit;
    totals.credit += credit;
    totals.net += balance;
  }

  return { grouped, totals, as_of_date: filters.as_of_date ?? defaults.asOf };
};

export const getCashFlow = async (
  userId: string,
  filters: { from_date?: string; to_date?: string }
) => {
  const defaults = defaultYearRange();
  const fromDate = new Date(filters.from_date ?? defaults.from);
  const toDate = new Date(filters.to_date ?? defaults.to);

  const cashAccounts = await ChartOfAccountModel.find({
    ...companyScope(userId),
    is_active: true,
    account_code: { $gte: "1000", $lte: "1099" },
  }).lean();

  let beginning_cash = 0;
  for (const account of cashAccounts) {
    beginning_cash += await getAccountBalance(userId, account._id!, { asOfDate: fromDate });
  }

  const sumCategory = async (start: number, end: number) => {
    const accounts = await ChartOfAccountModel.find({
      ...companyScope(userId),
      is_active: true,
      account_code: {
        $gte: String(start).padStart(4, "0"),
        $lte: String(end).padStart(4, "0"),
      },
    }).lean();
    let total = 0;
    for (const account of accounts) {
      total += await getPeriodMovementBalance(userId, account._id!, fromDate, toDate);
    }
    return total;
  };

  const operating = await sumCategory(4000, 5999);
  const investing = await sumCategory(1100, 1999);
  const financing = await sumCategory(2000, 3999);
  const net_cash_flow = operating + investing + financing;
  const ending_cash = beginning_cash + net_cash_flow;

  return {
    beginning_cash,
    operating,
    investing,
    financing,
    net_cash_flow,
    ending_cash,
    from_date: filters.from_date ?? defaults.from,
    to_date: filters.to_date ?? defaults.to,
  };
};

export const getExpenseReport = async (
  userId: string,
  filters: { from_date?: string; to_date?: string }
) => {
  const defaults = defaultYearRange();
  const fromDate = new Date(filters.from_date ?? defaults.from);
  const toDate = new Date(filters.to_date ?? defaults.to);

  const accounts = await ChartOfAccountModel.find({
    ...companyScope(userId),
    is_active: true,
    account_code: { $gte: "5000", $lte: "5999" },
  })
    .sort({ account_code: 1 })
    .lean();

  const expenses: Array<{ account_code: string; account_name: string; amount: number }> = [];
  let total_expenses = 0;

  for (const account of accounts) {
    const balance = await getPeriodMovementBalance(userId, account._id!, fromDate, toDate);
    if (Math.abs(balance) < 0.01) continue;
    const amount = Math.abs(balance);
    expenses.push({
      account_code: account.account_code,
      account_name: account.account_name,
      amount,
    });
    total_expenses += amount;
  }

  expenses.sort((a, b) => b.amount - a.amount);

  return {
    expenses,
    total_expenses,
    from_date: filters.from_date ?? defaults.from,
    to_date: filters.to_date ?? defaults.to,
  };
};
