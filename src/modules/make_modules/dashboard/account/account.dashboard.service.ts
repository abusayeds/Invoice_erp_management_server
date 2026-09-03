/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, PipelineStage } from "mongoose";
import { AuthRequest } from "../../../../middlewares/auth";
import { AccountRevenueModel } from "../../account/accountRevenue/accountRevenue.model";
import { AccountExpenseModel } from "../../account/accountExpense/accountExpense.model";
import { CustomerPaymentModel } from "../../account/customerPayment/customerPayment.model";
import { VendorPaymentModel } from "../../account/vendorPayment/vendorPayment.model";
import { CreditNoteModel } from "../../creditNote/creditNote.model";
import { DebitNoteModel } from "../../debitNote/debitNote.model";
import { InvoiceReturnModel } from "../../invoice/invoiceReturn/invoiceReturn.model";
import { InvoiceModel } from "../../invoice/invoice.model";
import { PurchaseReturnModel } from "../../purchase/purchaseReturn/purchaseReturn.model";
import {
  actorRole,
  companyObjectId,
  companyScope,
  countCompanyUsers,
  lastSixMonths,
  monthRange,
  resolveActorUserId,
  resolveCompanyId,
  ROLE,
} from "../dashboard.utils";

const fmtDate = (d?: Date) =>
  d ? new Date(d).toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "";

/** Sum a numeric field over a filter (Laravel ->sum('field')). */
const sumField = async (model: Model<any>, match: Record<string, any>, field: string) => {
  const pipeline: PipelineStage[] = [
    { $match: match },
    { $group: { _id: null, total: { $sum: `$${field}` } } },
  ];
  const r = await model.aggregate(pipeline);
  return r[0]?.total || 0;
};

/* ----------------------------- COMPANY ----------------------------- */
const companyDashboard = async (companyId: string) => {
  const scope = companyScope(companyId);

  const [
    totalClients,
    totalVendors,
    totalRevenue,
    totalExpense,
    totalCustomerPayments,
    totalVendorPayments,
  ] = await Promise.all([
    countCompanyUsers(companyId, ROLE.customer),
    countCompanyUsers(companyId, ROLE.vendor),
    sumField(AccountRevenueModel, scope, "amount"),
    sumField(AccountExpenseModel, scope, "amount"),
    sumField(CustomerPaymentModel, scope, "payment_amount"),
    sumField(VendorPaymentModel, scope, "payment_amount"),
  ]);

  const recentRevenues = (
    await AccountRevenueModel.find(scope).sort({ createdAt: -1 }).limit(5).lean()
  ).map((item: any) => ({
    id: item._id,
    title: item.revenue_number,
    description: item.description || "Revenue transaction",
    amount: item.amount,
    date: item.createdAt,
  }));

  const recentExpenses = (
    await AccountExpenseModel.find(scope).sort({ createdAt: -1 }).limit(5).lean()
  ).map((item: any) => ({
    id: item._id,
    title: item.expense_number,
    description: item.description || "Expense transaction",
    amount: item.amount,
    date: item.createdAt,
  }));

  const months = lastSixMonths();
  const monthlyCustomerPayments = await Promise.all(
    months.map(async ({ label, range }) => ({
      month: label,
      customer_payments: await sumField(
        CustomerPaymentModel,
        { ...scope, createdAt: range },
        "payment_amount"
      ),
    }))
  );
  const monthlyVendorPayments = await Promise.all(
    months.map(async ({ label, range }) => ({
      month: label,
      vendor_payments: await sumField(
        VendorPaymentModel,
        { ...scope, createdAt: range },
        "payment_amount"
      ),
    }))
  );

  return {
    stats: {
      total_clients: totalClients,
      total_vendors: totalVendors,
      total_revenue: totalRevenue,
      total_expense: totalExpense,
      total_customer_payment: totalCustomerPayments,
      total_vendor_payment: totalVendorPayments,
      net_profit: totalRevenue - totalExpense,
    },
    monthlyCustomerPayments,
    monthlyVendorPayments,
    recentRevenues,
    recentExpenses,
  };
};

/* ------------------------------ VENDOR ----------------------------- */
const vendorDashboard = async (companyId: string, userId: string) => {
  const scope = companyScope(companyId);
  const vendorId = companyObjectId(userId);
  const vendorMatch = { ...scope, vendor_id: vendorId };

  const [totalPayments, totalExpenses, paymentCount] = await Promise.all([
    sumField(VendorPaymentModel, vendorMatch, "payment_amount"),
    sumField(AccountExpenseModel, scope, "amount"),
    VendorPaymentModel.countDocuments(vendorMatch),
  ]);

  const monthlyPayments = await Promise.all(
    lastSixMonths().map(async ({ label, range }) => ({
      month: label,
      payments: await sumField(
        VendorPaymentModel,
        { ...vendorMatch, createdAt: range },
        "payment_amount"
      ),
    }))
  );

  const recentReturnInvoices = (
    await PurchaseReturnModel.find(vendorMatch).sort({ createdAt: -1 }).limit(5).lean()
  ).map((r: any) => ({
    id: r._id,
    invoice_number: r.return_number || `PUR-RET-${r._id}`,
    amount: r.total_amount || 0,
    date: fmtDate(r.createdAt),
    status: r.status || "Pending",
  }));

  const recentDebitNotes = (
    await DebitNoteModel.find(vendorMatch).sort({ createdAt: -1 }).limit(5).lean()
  ).map((n: any) => ({
    id: n._id,
    debit_note_number: n.invoice_number || `DN-${n._id}`,
    amount: n.total || 0,
    date: fmtDate(n.createdAt),
    status: n.status || "Pending",
  }));

  return {
    stats: { total_payments: totalPayments, total_expenses: totalExpenses, payment_count: paymentCount },
    monthlyPayments,
    recentReturnInvoices,
    recentDebitNotes,
  };
};

/* ------------------------------ CLIENT ----------------------------- */
const clientDashboard = async (companyId: string, userId: string) => {
  const scope = companyScope(companyId);
  const customerId = companyObjectId(userId);
  const custMatch = { ...scope, customer_id: customerId };

  const [totalPayments, totalRevenues, paymentCount] = await Promise.all([
    sumField(CustomerPaymentModel, custMatch, "payment_amount"),
    sumField(AccountRevenueModel, scope, "amount"),
    CustomerPaymentModel.countDocuments(custMatch),
  ]);

  const monthlyPayments = await Promise.all(
    lastSixMonths().map(async ({ label, range }) => ({
      month: label,
      payments: await sumField(
        CustomerPaymentModel,
        { ...custMatch, createdAt: range },
        "payment_amount"
      ),
    }))
  );

  // SalesInvoiceReturn has no customer_id — derive via the customer's invoices.
  const invoiceIds = (
    await InvoiceModel.find({ ...scope, customer_id: customerId }).select("_id").lean()
  ).map((i: any) => i._id);
  const recentReturnInvoices = (
    await InvoiceReturnModel.find({ ...scope, invoice_id: { $in: invoiceIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
  ).map((r: any) => ({
    id: r._id,
    invoice_number: `RET-${r._id}`,
    amount: 0,
    date: fmtDate(r.createdAt),
    status: r.status || "Returned",
  }));

  const recentCreditNotes = (
    await CreditNoteModel.find(custMatch).sort({ createdAt: -1 }).limit(5).lean()
  ).map((n: any) => ({
    id: n._id,
    credit_note_number: n.invoice_number || `CN-${n._id}`,
    amount: n.total || 0,
    date: fmtDate(n.createdAt),
    status: n.status || "Pending",
  }));

  return {
    stats: { total_payments: totalPayments, total_revenues: totalRevenues, payment_count: paymentCount },
    monthlyPayments,
    recentReturnInvoices,
    recentCreditNotes,
  };
};

/* ------------------------------ STAFF ------------------------------ */
const staffDashboard = async (companyId: string) => {
  const scope = companyScope(companyId);
  const now = new Date();
  const thisMonth = monthRange(now.getFullYear(), now.getMonth());

  const [totalClients, totalVendors, monthlyRevenue, monthlyExpense] = await Promise.all([
    countCompanyUsers(companyId, ROLE.customer),
    countCompanyUsers(companyId, ROLE.vendor),
    sumField(AccountRevenueModel, { ...scope, createdAt: thisMonth }, "amount"),
    sumField(AccountExpenseModel, { ...scope, createdAt: thisMonth }, "amount"),
  ]);

  const revenues = (await AccountRevenueModel.find(scope).sort({ createdAt: -1 }).limit(3).lean()).map(
    (item: any) => ({ type: "Revenue", title: item.revenue_number, amount: item.amount, date: item.createdAt })
  );
  const expenses = (await AccountExpenseModel.find(scope).sort({ createdAt: -1 }).limit(3).lean()).map(
    (item: any) => ({ type: "Expense", title: item.expense_number, amount: item.amount, date: item.createdAt })
  );
  const recentActivities = [...revenues, ...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return {
    stats: {
      total_clients: totalClients,
      total_vendors: totalVendors,
      monthly_revenue: monthlyRevenue,
      monthly_expense: monthlyExpense,
    },
    recentActivities,
  };
};

const getDashboard = async (req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  const userId = resolveActorUserId(req);
  const type = actorRole(req);

  if (type === ROLE.company || type === ROLE.superadmin) return companyDashboard(companyId);
  if (type === ROLE.vendor) return vendorDashboard(companyId, userId);
  if (type === ROLE.customer) return clientDashboard(companyId, userId);
  return staffDashboard(companyId);
};

export const accountDashboardService = { getDashboard };
