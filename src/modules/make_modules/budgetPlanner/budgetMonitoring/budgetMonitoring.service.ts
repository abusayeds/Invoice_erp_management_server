import queryBuilder from "../../../../builder/queryBuilder";
import { companyScope } from "../../account/account.utils";
import { BudgetMonitoringModel } from "./budgetMonitoring.model";

const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const base = BudgetMonitoringModel.find({ ...companyScope(userId), isDeleted: false })
    .populate("budget_id", "budget_name status budget_type total_budget_amount");
  const build = new queryBuilder(base, query).filter().sort().fields();
  const { totalData } = await build.paginate(
    BudgetMonitoringModel.find({ ...companyScope(userId), isDeleted: false })
  );
  const rows = await build.modelQuery.exec();
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  return { rows, pagination: build.calculatePagination({ totalData, currentPage: page, limit }) };
};

export const budgetMonitoringService = { getAllDB };
