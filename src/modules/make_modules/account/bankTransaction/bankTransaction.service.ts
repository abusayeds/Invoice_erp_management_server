import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { companyScope } from "../account.utils";
import { BankTransactionModel } from "./bankTransaction.model";

const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const base = BankTransactionModel.find(companyScope(userId)).populate(
    "bank_account_id",
    "account_name account_number"
  );
  const build = new queryBuilder(base, query)
    .search(["reference_number", "description"])
    .filter()
    .sort()
    .fields();
  const { totalData } = await build.paginate(BankTransactionModel.find(companyScope(userId)));
  const rows = await build.modelQuery.exec();
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  return { rows, pagination: build.calculatePagination({ totalData, currentPage: page, limit }) };
};

const markReconciledDB = async (id: string, userId: string) => {
  const record = await BankTransactionModel.findOne({ _id: id, ...companyScope(userId) });
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "Bank transaction not found");
  if (record.reconciliation_status !== "unreconciled") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only unreconciled transactions can be marked reconciled"
    );
  }
  record.reconciliation_status = "reconciled";
  await record.save();
  return record;
};

export const bankTransactionService = { getAllDB, markReconciledDB };
