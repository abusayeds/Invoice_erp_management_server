import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { companyObjectId, companyScope, generateAccountNumber } from "../account.utils";
import { BankAccountModel } from "../bankAccount/bankAccount.model";
import { ChartOfAccountModel } from "../chartOfAccount/chartOfAccount.model";
import { updateCoaBalancesFromJournal, journalExistsForReference } from "../ledger/ledger.service";
import { JournalEntryModel } from "./journalEntry.model";
import { JournalEntryItemModel } from "./journalEntryItem.model";

const validateBalanced = (debit: number, credit: number) => {
  if (Math.abs(debit - credit) > 0.01) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Journal entry not balanced: debit ${debit} != credit ${credit}`
    );
  }
};

type JournalLine = {
  account_id: Types.ObjectId;
  description: string;
  debit_amount: number;
  credit_amount: number;
};

const createPostedJournal = async (
  userId: string,
  creatorId: Types.ObjectId | undefined,
  payload: {
    journal_date: Date;
    reference_type: string;
    reference_id?: Types.ObjectId;
    description: string;
    lines: JournalLine[];
  }
) => {
  const totalDebit = payload.lines.reduce((s, l) => s + l.debit_amount, 0);
  const totalCredit = payload.lines.reduce((s, l) => s + l.credit_amount, 0);
  validateBalanced(totalDebit, totalCredit);

  const userOid = companyObjectId(userId);
  const journal_number = await generateAccountNumber(
    JournalEntryModel,
    "JE",
    userOid,
    "journal_number"
  );

  const entry = await JournalEntryModel.create({
    user_id: userOid,
    creator_id: creatorId,
    journal_number,
    journal_date: payload.journal_date,
    entry_type: "automatic",
    reference_type: payload.reference_type,
    reference_id: payload.reference_id,
    description: payload.description,
    total_debit: totalDebit,
    total_credit: totalCredit,
    status: "posted",
  });

  await JournalEntryItemModel.insertMany(
    payload.lines.map((line) => ({
      user_id: userOid,
      creator_id: creatorId,
      journal_entry_id: entry._id,
      account_id: line.account_id,
      description: line.description,
      debit_amount: line.debit_amount,
      credit_amount: line.credit_amount,
    }))
  );

  await updateCoaBalancesFromJournal(entry._id!, userId);
  return entry;
};

export const createRevenueEntryJournal = async (
  userId: string,
  creatorId: Types.ObjectId | undefined,
  revenue: {
    _id: Types.ObjectId;
    revenue_number: string;
    revenue_date: Date;
    amount: number;
    bank_account_id: Types.ObjectId;
    chart_of_account_id: Types.ObjectId;
  }
) => {
  if (await journalExistsForReference(userId, "revenue", revenue._id)) {
    return null;
  }

  const bank = await BankAccountModel.findOne({
    _id: revenue.bank_account_id,
    ...companyScope(userId),
  });
  if (!bank?.gl_account_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bank account must have a GL account assigned");
  }

  const revenueAccount = await ChartOfAccountModel.findOne({
    _id: revenue.chart_of_account_id,
    ...companyScope(userId),
  });
  if (!revenueAccount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Revenue chart of account not found");
  }

  return createPostedJournal(userId, creatorId, {
    journal_date: revenue.revenue_date,
    reference_type: "revenue",
    reference_id: revenue._id,
    description: `Revenue Entry - #${revenue.revenue_number}`,
    lines: [
      {
        account_id: bank.gl_account_id,
        description: "Revenue received",
        debit_amount: revenue.amount,
        credit_amount: 0,
      },
      {
        account_id: revenue.chart_of_account_id,
        description: "Revenue earned",
        debit_amount: 0,
        credit_amount: revenue.amount,
      },
    ],
  });
};

export const createExpenseEntryJournal = async (
  userId: string,
  creatorId: Types.ObjectId | undefined,
  expense: {
    _id: Types.ObjectId;
    expense_number: string;
    expense_date: Date;
    amount: number;
    bank_account_id: Types.ObjectId;
    chart_of_account_id: Types.ObjectId;
  }
) => {
  if (await journalExistsForReference(userId, "expense", expense._id)) {
    return null;
  }

  const bank = await BankAccountModel.findOne({
    _id: expense.bank_account_id,
    ...companyScope(userId),
  });
  if (!bank?.gl_account_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bank account must have a GL account assigned");
  }

  const expenseAccount = await ChartOfAccountModel.findOne({
    _id: expense.chart_of_account_id,
    ...companyScope(userId),
  });
  if (!expenseAccount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Expense chart of account not found");
  }

  return createPostedJournal(userId, creatorId, {
    journal_date: expense.expense_date,
    reference_type: "expense",
    reference_id: expense._id,
    description: `Expense Entry - #${expense.expense_number}`,
    lines: [
      {
        account_id: expense.chart_of_account_id,
        description: "Expense incurred",
        debit_amount: expense.amount,
        credit_amount: 0,
      },
      {
        account_id: bank.gl_account_id,
        description: "Payment made",
        debit_amount: 0,
        credit_amount: expense.amount,
      },
    ],
  });
};

export const createYearEndCloseJournal = async (
  userId: string,
  creatorId: Types.ObjectId | undefined,
  financialYear: string,
  closingDate: Date,
  lines: JournalLine[],
  retainedEarningsAccountId: Types.ObjectId,
  netIncome: number
) => {
  const allLines = [...lines];
  if (Math.abs(netIncome) > 0.01) {
    allLines.push({
      account_id: retainedEarningsAccountId,
      description: "Transfer net income to retained earnings",
      debit_amount: netIncome < 0 ? Math.abs(netIncome) : 0,
      credit_amount: netIncome >= 0 ? netIncome : 0,
    });
  }

  return createPostedJournal(userId, creatorId, {
    journal_date: closingDate,
    reference_type: "year_end_close",
    description: `Year-end closing entries for ${financialYear}`,
    lines: allLines,
  });
};
