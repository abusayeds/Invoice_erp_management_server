import { Model } from "mongoose";
import { UserModel } from "../../../basic_modules/user/user.model";
import { role } from "../../../../utils/role";
import { partyBaseFilter } from "../../../../utils/partyUser";
import { companyObjectId } from "../account.utils";
import { AccountRevenueModel } from "../accountRevenue/accountRevenue.model";
import { AccountExpenseModel } from "../accountExpense/accountExpense.model";
import { CustomerPaymentModel } from "../customerPayment/customerPayment.model";
import { VendorPaymentModel } from "../vendorPayment/vendorPayment.model";

const monthLabels = () => {
  const labels: { month: string; date: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    labels.push({
      month: d.toLocaleString("en", { month: "short" }),
      date: d,
    });
  }
  return labels;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sumByMonth = async (
  Model: Model<any>,
  userId: string,
  dateField: string,
  amountField: string,
  extraFilter: Record<string, unknown> = {}
) => {
  const months = monthLabels();
  const results = [];
  for (const { month, date } of months) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    const rows = await Model.aggregate([
      {
        $match: {
          user_id: companyObjectId(userId),
          isDeleted: false,
          ...extraFilter,
          [dateField]: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, total: { $sum: `$${amountField}` } } },
    ]);
    results.push({ month, total: rows[0]?.total ?? 0 });
  }
  return results;
};

const getCompanyDashboardDB = async (userId: string) => {
  const companyId = companyObjectId(userId);

  const [totalClients, totalVendors, revenueAgg, expenseAgg, customerPayAgg, vendorPayAgg] =
    await Promise.all([
      UserModel.countDocuments(partyBaseFilter(companyId, role.customer)),
      UserModel.countDocuments(partyBaseFilter(companyId, role.vendor)),
      AccountRevenueModel.aggregate([
        { $match: { user_id: companyId, isDeleted: false, status: "posted" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      AccountExpenseModel.aggregate([
        { $match: { user_id: companyId, isDeleted: false, status: "posted" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      CustomerPaymentModel.aggregate([
        { $match: { user_id: companyId, isDeleted: false, status: "cleared" } },
        { $group: { _id: null, total: { $sum: "$payment_amount" } } },
      ]),
      VendorPaymentModel.aggregate([
        { $match: { user_id: companyId, isDeleted: false, status: "cleared" } },
        { $group: { _id: null, total: { $sum: "$payment_amount" } } },
      ]),
    ]);

  const totalRevenue = revenueAgg[0]?.total ?? 0;
  const totalExpense = expenseAgg[0]?.total ?? 0;

  const [recentRevenues, recentExpenses, monthlyCustomerPayments, monthlyVendorPayments] =
    await Promise.all([
      AccountRevenueModel.find({ user_id: companyId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("revenue_number description amount createdAt")
        .lean(),
      AccountExpenseModel.find({ user_id: companyId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("expense_number description amount createdAt")
        .lean(),
      sumByMonth(CustomerPaymentModel, userId, "payment_date", "payment_amount", {
        status: "cleared",
      }),
      sumByMonth(VendorPaymentModel, userId, "payment_date", "payment_amount", {
        status: "cleared",
      }),
    ]);

  return {
    stats: {
      total_clients: totalClients,
      total_vendors: totalVendors,
      total_revenue: totalRevenue,
      total_expense: totalExpense,
      total_customer_payment: customerPayAgg[0]?.total ?? 0,
      total_vendor_payment: vendorPayAgg[0]?.total ?? 0,
      net_profit: totalRevenue - totalExpense,
    },
    monthlyCustomerPayments: monthlyCustomerPayments.map((m) => ({
      month: m.month,
      customer_payments: m.total,
    })),
    monthlyVendorPayments: monthlyVendorPayments.map((m) => ({
      month: m.month,
      vendor_payments: m.total,
    })),
    recentRevenues: recentRevenues.map((r) => ({
      _id: r._id,
      title: r.revenue_number,
      description: r.description ?? "Revenue transaction",
      amount: r.amount,
      date: (r as { createdAt?: Date }).createdAt,
    })),
    recentExpenses: recentExpenses.map((e) => ({
      _id: e._id,
      title: e.expense_number,
      description: e.description ?? "Expense transaction",
      amount: e.amount,
      date: (e as { createdAt?: Date }).createdAt,
    })),
  };
};

export const dashboardService = { getCompanyDashboardDB };
