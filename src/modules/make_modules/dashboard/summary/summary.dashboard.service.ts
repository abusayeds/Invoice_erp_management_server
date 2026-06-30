/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { Model, PipelineStage, Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { UserModel } from "../../../basic_modules/user/user.model";
import { role } from "../../../../utils/role";
import { InvoiceModel } from "../../invoice/invoice.model";
import { BillModel } from "../../bill/bill.model";
import { EstimateModel } from "../../estimate/estimate.model";
import { ProformaInvoiceModel } from "../../proformaInvoice/proformaInvoice.model";
import { ExpensesModel } from "../../expenses/expenses.model";
import { PurchaseInvoiceModel } from "../../purchase/purchaseInvoice/purchaseInvoice.model";
import { CustomerPaymentModel } from "../../account/customerPayment/customerPayment.model";
import { VendorPaymentModel } from "../../account/vendorPayment/vendorPayment.model";
import { AccountExpenseModel } from "../../account/accountExpense/accountExpense.model";
import { ProductModel } from "../../product/product.model";
import queryBuilder from "../../../../builder/queryBuilder";
import paginationBuilder from "../../../../utils/paginationBuilder";
import {
  CUSTOMER_ROLE_VALUES,
  isCustomerRole,
  PARTY_SEARCH_FIELDS,
} from "../../../../utils/partyUser";
import {
  companyObjectId,
  companyScope,
  endOfDay,
  resolveCompanyId,
  startOfDay,
} from "../dashboard.utils";

type SummaryQuery = {
  period?: string;
  from?: string;
  to?: string;
  granularity?: string;
  currency?: string;
  role?: string;
  user_id?: string | string[];
  user_ids?: string | string[];
  page?: string;
  limit?: string;
};

type DateRange = { from: Date; to: Date; label: string };

type PartyRoleScope = "customer" | "vendor";

type PartiesFilter = {
  customerIds: Types.ObjectId[];
  vendorIds: Types.ObjectId[];
  users: { id: string; role: string; name?: string }[];
  roleScope?: PartyRoleScope;
};

const EXCLUDED_DOC_STATUS = { $nin: ["Draft", "Void"] };

const round2 = (n: number) => Math.round(n * 100) / 100;

const sumField = async (model: Model<any>, match: Record<string, any>, field: string) => {
  const pipeline: PipelineStage[] = [
    { $match: match },
    { $group: { _id: null, total: { $sum: `$${field}` } } },
  ];
  const r = await model.aggregate(pipeline);
  return round2(r[0]?.total || 0);
};

const resolveDateRange = (query: SummaryQuery): DateRange => {
  const now = new Date();
  const period = query.period || "this_year";
  const hasCustomDates = Boolean(query.from?.trim() || query.to?.trim());

  // from/to দিলেই custom range — period=custom বাধ্য নয়
  if (hasCustomDates || period === "custom") {
    if (!query.from?.trim()) {
      throw new AppError(httpStatus.BAD_REQUEST, "from date is required for a custom date range");
    }
    return {
      from: startOfDay(new Date(query.from.trim())),
      to: query.to?.trim() ? endOfDay(new Date(query.to.trim())) : endOfDay(now),
      label: "custom",
    };
  }

  if (period === "this_month") {
    return {
      from: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
      to: endOfDay(now),
      label: "this_month",
    };
  }

  if (period === "last_30_days") {
    const from = new Date(now);
    from.setDate(from.getDate() - 30);
    return { from: startOfDay(from), to: endOfDay(now), label: "last_30_days" };
  }

  return {
    from: startOfDay(new Date(now.getFullYear(), 0, 1)),
    to: endOfDay(now),
    label: "this_year",
  };
};

const paymentDateInRange = (range: DateRange) => ({
  payment_date: { $gte: range.from, $lte: range.to },
});

const expenseDateInRange = (range: DateRange) => ({
  expense_date: { $gte: range.from, $lte: range.to },
});

const invoiceDateInRange = (range: DateRange) => ({
  $or: [
    { date: { $gte: range.from, $lte: range.to } },
    {
      $and: [
        { $or: [{ date: { $exists: false } }, { date: null }] },
        { createdAt: { $gte: range.from, $lte: range.to } },
      ],
    },
  ],
});

const purchaseDateInRange = (range: DateRange) => ({
  date: { $gte: range.from, $lte: range.to },
});

const currencyMatch = (currency?: string) =>
  currency && currency !== "all" ? { currency } : {};

const parseUserIds = (query: Record<string, unknown>): string[] => {
  const raw = query.user_id ?? query.user_ids;
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  const ids = new Set<string>();
  for (const entry of list) {
    String(entry)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((id) => ids.add(id));
  }
  return [...ids];
};

const parseSummaryRoleScope = (query: Record<string, unknown>): PartyRoleScope | undefined => {
  const raw = String(query.role ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return undefined;
  if (raw === "customer" || raw === "client") return "customer";
  if (raw === "vendor") return "vendor";
  throw new AppError(httpStatus.BAD_REQUEST, "role must be customer or vendor");
};

/** No user_id/role → company-wide both. role only → that party type. user_id → those parties (optional role check). */
const resolvePartiesFilter = async (
  companyId: string,
  userIds: string[],
  roleScope?: PartyRoleScope,
): Promise<PartiesFilter | null> => {
  if (userIds.length) {
    const invalid = userIds.filter((id) => !Types.ObjectId.isValid(id));
    if (invalid.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "One or more user_id values are invalid");
    }

    const objectIds = userIds.map((id) => companyObjectId(id));
    const users = await UserModel.find({
      _id: { $in: objectIds },
      companyId: companyObjectId(companyId),
      role: { $in: [...CUSTOMER_ROLE_VALUES, role.vendor] },
      isDeleted: false,
    })
      .select("role name")
      .lean();

    if (users.length !== userIds.length) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "One or more customers/vendors were not found for this company",
      );
    }

    const customerIds: Types.ObjectId[] = [];
    const vendorIds: Types.ObjectId[] = [];
    const usersMeta: PartiesFilter["users"] = [];

    for (const user of users) {
      const row = user as unknown as { _id: Types.ObjectId; role: string; name?: string };
      if (isCustomerRole(row.role)) {
        if (roleScope === "vendor") {
          throw new AppError(httpStatus.BAD_REQUEST, "user_id must belong to a vendor when role=vendor");
        }
        customerIds.push(row._id);
      } else if (row.role === role.vendor) {
        if (roleScope === "customer") {
          throw new AppError(httpStatus.BAD_REQUEST, "user_id must belong to a customer when role=customer");
        }
        vendorIds.push(row._id);
      } else {
        throw new AppError(httpStatus.BAD_REQUEST, "user_id must be a customer or vendor");
      }
      usersMeta.push({ id: String(row._id), role: row.role, name: row.name });
    }

    return { customerIds, vendorIds, users: usersMeta, roleScope };
  }

  if (roleScope) {
    return { customerIds: [], vendorIds: [], users: [], roleScope };
  }

  return null;
};

const shouldIncludeCustomers = (party: PartiesFilter | null) => {
  if (!party) return true;
  if (party.roleScope === "vendor") return false;
  if (party.roleScope === "customer") return true;
  if (party.customerIds.length > 0) return true;
  if (party.vendorIds.length > 0 && party.customerIds.length === 0) return false;
  return true;
};

const shouldIncludeVendors = (party: PartiesFilter | null) => {
  if (!party) return true;
  if (party.roleScope === "customer") return false;
  if (party.roleScope === "vendor") return true;
  if (party.vendorIds.length > 0) return true;
  if (party.customerIds.length > 0 && party.vendorIds.length === 0) return false;
  return true;
};

const customerMatch = (party: PartiesFilter | null) => {
  if (!shouldIncludeCustomers(party)) return noMatch();
  if (party?.customerIds.length) return { customer_id: { $in: party.customerIds } };
  return {};
};

const vendorMatch = (party: PartiesFilter | null) => {
  if (!shouldIncludeVendors(party)) return noMatch();
  if (party?.vendorIds.length) return { vendor_id: { $in: party.vendorIds } };
  return {};
};

const expensePartiesMatch = (party: PartiesFilter | null) => {
  if (!party) return {};
  const clauses: Record<string, unknown>[] = [];
  if (party.customerIds.length) clauses.push({ customer_id: { $in: party.customerIds } });
  if (party.vendorIds.length) clauses.push({ vendor_id: { $in: party.vendorIds } });
  if (!clauses.length) return noMatch();
  return clauses.length === 1 ? clauses[0] : { $or: clauses };
};

const customerUserQuery = (companyOid: Types.ObjectId, party: PartiesFilter | null) => {
  const base = { companyId: companyOid, role: { $in: [...CUSTOMER_ROLE_VALUES] }, isDeleted: false };
  if (!party) return base;
  if (!shouldIncludeCustomers(party)) return { ...base, _id: { $exists: false } };
  if (party.customerIds.length) return { ...base, _id: { $in: party.customerIds } };
  return base;
};

const vendorUserQuery = (companyOid: Types.ObjectId, party: PartiesFilter | null) => {
  const base = { companyId: companyOid, role: role.vendor, isDeleted: false };
  if (!party) return base;
  if (!shouldIncludeVendors(party)) return { ...base, _id: { $exists: false } };
  if (party.vendorIds.length) return { ...base, _id: { $in: party.vendorIds } };
  return base;
};

const noMatch = () => ({ _id: { $exists: false } });

const docScope = (
  companyId: string,
  range: DateRange,
  currency?: string,
  party?: PartiesFilter | null,
  side: "customer" | "vendor" | "expense" = "customer",
) => {
  const base = {
    ...companyScope(companyId),
    status: EXCLUDED_DOC_STATUS,
    ...invoiceDateInRange(range),
    ...currencyMatch(currency),
  };
  if (!party) return base;
  if (side === "customer") {
    return shouldIncludeCustomers(party) ? { ...base, ...customerMatch(party) } : { ...base, ...noMatch() };
  }
  if (side === "vendor") {
    return shouldIncludeVendors(party) ? { ...base, ...vendorMatch(party) } : { ...base, ...noMatch() };
  }
  return { ...base, ...expensePartiesMatch(party) };
};

const fmtActivityDate = (d?: Date) =>
  d
    ? new Date(d).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "";

const buildStats = async (
  companyId: string,
  range: DateRange,
  currency?: string,
  party?: PartiesFilter | null,
) => {
  const scope = companyScope(companyId);
  const cur = currencyMatch(currency);
  const today = startOfDay(new Date());
  const customerOnly = customerMatch(party ?? null);
  const vendorOnly = vendorMatch(party ?? null);
  const skipCustomer = !shouldIncludeCustomers(party ?? null);
  const skipVendor = !shouldIncludeVendors(party ?? null);
  const skipAccountExpense = Boolean(party);
  const overdueCutoff = range.to < today ? endOfDay(range.to) : today;

  const invoiceOutstandingMatch = {
    ...scope,
    archive: false,
    balance_amount: { $gt: 0 },
    ...invoiceDateInRange(range),
    ...customerOnly,
    ...(skipCustomer ? noMatch() : {}),
  };

  const payableBillMatch = {
    ...scope,
    archive: false,
    balance_amount: { $gt: 0 },
    ...invoiceDateInRange(range),
    ...vendorOnly,
    ...(skipVendor ? noMatch() : {}),
  };

  const payablePurchaseMatch = {
    ...scope,
    balance_amount: { $gt: 0 },
    ...purchaseDateInRange(range),
    ...vendorOnly,
    ...(skipVendor ? noMatch() : {}),
  };

  const [
    outstanding,
    payableBills,
    payablePurchase,
    sales,
    proformaInvoices,
    paymentReceived,
    estimates,
    docExpenses,
    accountExpenses,
    purchaseOrders,
    paymentMade,
    bills,
    overdue,
  ] = await Promise.all([
    sumField(InvoiceModel, invoiceOutstandingMatch, "balance_amount"),
    sumField(BillModel, payableBillMatch, "balance_amount"),
    sumField(PurchaseInvoiceModel, payablePurchaseMatch, "balance_amount"),
    sumField(InvoiceModel, docScope(companyId, range, currency, party, "customer"), "total"),
    sumField(ProformaInvoiceModel, docScope(companyId, range, currency, party, "customer"), "total"),
    sumField(
      CustomerPaymentModel,
      {
        ...scope,
        ...paymentDateInRange(range),
        status: { $ne: "cancelled" },
        ...customerOnly,
        ...(skipCustomer ? noMatch() : {}),
      },
      "payment_amount",
    ),
    sumField(EstimateModel, docScope(companyId, range, currency, party, "customer"), "total"),
    sumField(
      ExpensesModel,
      party ? docScope(companyId, range, currency, party, "expense") : docScope(companyId, range, currency, party),
      "total",
    ),
    skipAccountExpense
      ? Promise.resolve(0)
      : sumField(
          AccountExpenseModel,
          { ...scope, ...expenseDateInRange(range), status: { $ne: "draft" } },
          "amount",
        ),
    sumField(
      PurchaseInvoiceModel,
      {
        ...scope,
        ...purchaseDateInRange(range),
        status: { $ne: "draft" },
        ...vendorOnly,
        ...(skipVendor ? noMatch() : {}),
      },
      "total",
    ),
    sumField(
      VendorPaymentModel,
      {
        ...scope,
        ...paymentDateInRange(range),
        status: { $ne: "cancelled" },
        ...vendorOnly,
        ...(skipVendor ? noMatch() : {}),
      },
      "payment_amount",
    ),
    sumField(BillModel, docScope(companyId, range, currency, party, "vendor"), "total"),
    sumField(
      InvoiceModel,
      {
        ...scope,
        archive: false,
        balance_amount: { $gt: 0 },
        due_date: { $lt: overdueCutoff },
        status: { $in: ["Partial", "Overdue", "Open"] },
        ...invoiceDateInRange(range),
        ...cur,
        ...customerOnly,
        ...(skipCustomer ? noMatch() : {}),
      },
      "balance_amount",
    ),
  ]);

  const expenses = round2(docExpenses + accountExpenses);
  const payableAmount = round2(payableBills + payablePurchase);
  const netProfit = round2(sales - expenses);

  return {
    outstanding: round2(-outstanding),
    payable_amount: payableAmount,
    net_profit: netProfit,
    sales,
    proforma_invoices: proformaInvoices,
    payment_received: paymentReceived,
    estimates,
    expenses,
    purchase_orders: purchaseOrders,
    bills,
    payment_made: paymentMade,
    overdue,
  };
};

type ChartGranularity = "day" | "week" | "month" | "year";

const resolveGranularity = (raw?: string): ChartGranularity => {
  const g = String(raw || "month").toLowerCase();
  if (g === "day" || g === "week" || g === "month" || g === "year") return g;
  return "month";
};

const clipRange = (from: Date, to: Date, range: DateRange) => ({
  from: from < range.from ? range.from : from,
  to: to > range.to ? range.to : to,
});

const chartBuckets = (range: DateRange, granularity: ChartGranularity) => {
  const buckets: { key: string; label: string; from: Date; to: Date }[] = [];

  if (granularity === "year") {
    for (let y = range.from.getFullYear(); y <= range.to.getFullYear(); y++) {
      const from = startOfDay(new Date(y, 0, 1));
      const to = endOfDay(new Date(y, 11, 31));
      const clipped = clipRange(from, to, range);
      buckets.push({ key: String(y), label: String(y), ...clipped });
    }
    return buckets;
  }

  if (granularity === "month") {
    const cursor = new Date(range.from.getFullYear(), range.from.getMonth(), 1);
    while (cursor <= range.to) {
      const from = startOfDay(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
      const to = endOfDay(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0));
      const clipped = clipRange(from, to, range);
      buckets.push({
        key: `${cursor.getFullYear()}-${cursor.getMonth() + 1}`,
        label: cursor.toLocaleString("en-US", { month: "short", year: "numeric" }),
        ...clipped,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return buckets;
  }

  if (granularity === "week") {
    const cursor = startOfDay(new Date(range.from));
    const end = endOfDay(new Date(range.to));
    while (cursor <= end) {
      const from = startOfDay(new Date(cursor));
      const weekEnd = new Date(cursor);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const to = endOfDay(weekEnd > end ? end : weekEnd);
      buckets.push({
        key: from.toISOString().slice(0, 10),
        label: `${from.toLocaleString("en-US", { month: "short", day: "numeric" })} – ${to.toLocaleString("en-US", { month: "short", day: "numeric" })}`,
        from,
        to,
      });
      cursor.setDate(cursor.getDate() + 7);
    }
    return buckets;
  }

  const cursor = startOfDay(new Date(range.from));
  const end = endOfDay(new Date(range.to));
  while (cursor <= end) {
    const from = startOfDay(new Date(cursor));
    const to = endOfDay(new Date(cursor));
    buckets.push({
      key: from.toISOString().slice(0, 10),
      label: from.toLocaleString("en-US", { month: "short", day: "numeric" }),
      from,
      to,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return buckets;
};

const buildChart = async (
  companyId: string,
  range: DateRange,
  granularity: ChartGranularity,
  currency?: string,
  party?: PartiesFilter | null,
) => {
  const buckets = chartBuckets(range, granularity);
  const skipAccountExpense = Boolean(party);

  const invoiceMatch = docScope(companyId, range, currency, party, "customer");
  const expenseDocMatch = party
    ? docScope(companyId, range, currency, party, "expense")
    : docScope(companyId, range, currency, party);

  const [invoices, docExpenses, accountExpenses] = await Promise.all([
    InvoiceModel.find(invoiceMatch).select("total date createdAt").lean(),
    ExpensesModel.find(expenseDocMatch).select("total date createdAt").lean(),
    skipAccountExpense
      ? Promise.resolve([])
      : AccountExpenseModel.find({
          ...companyScope(companyId),
          status: { $ne: "draft" },
          ...expenseDateInRange(range),
        })
          .select("amount expense_date")
          .lean(),
  ]);

  const docDate = (row: { date?: Date; createdAt?: Date }) =>
    row.date ? new Date(row.date) : row.createdAt ? new Date(row.createdAt) : null;

  const inBucket = (d: Date | null, bucket: { from: Date; to: Date }) =>
    d && d >= bucket.from && d <= bucket.to;

  const labels: string[] = [];
  const sales: number[] = [];
  const expenses: number[] = [];
  const profit: number[] = [];

  for (const bucket of buckets) {
    const bucketSales = invoices
      .filter((row) => inBucket(docDate(row), bucket))
      .reduce((sum, row) => sum + (row.total || 0), 0);
    const bucketDocExp = docExpenses
      .filter((row) => inBucket(docDate(row), bucket))
      .reduce((sum, row) => sum + (row.total || 0), 0);
    const bucketAccExp = accountExpenses
      .filter((row) => inBucket(row.expense_date ? new Date(row.expense_date) : null, bucket))
      .reduce((sum, row) => sum + (row.amount || 0), 0);
    const bucketExp = bucketDocExp + bucketAccExp;

    labels.push(bucket.label);
    sales.push(round2(bucketSales));
    expenses.push(round2(bucketExp));
    profit.push(round2(bucketSales - bucketExp));
  }

  return {
    granularity,
    currency: currency || "USD",
    labels,
    sales,
    expenses,
    profit,
  };
};

const buildTopCustomers = async (companyId: string, party?: PartiesFilter | null, limit = 5) => {
  if (party && !shouldIncludeCustomers(party)) return [];

  const match: Record<string, unknown> = {
    ...companyScope(companyId),
    status: EXCLUDED_DOC_STATUS,
    customer_id: { $exists: true, $ne: null },
    ...customerMatch(party ?? null),
  };

  const rows = await InvoiceModel.aggregate([
    { $match: match },
    { $group: { _id: "$customer_id", amount: { $sum: "$total" } } },
    { $sort: { amount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
  ]);

  return rows.map((row) => ({
    id: row._id,
    name: row.customer?.name || row.customer?.businessProfile?.companyName || "Unknown",
    amount: round2(row.amount),
  }));
};

const aggregateTopProductsFromInvoices = async (
  companyId: string,
  party: PartiesFilter | null,
  limit: number,
) => {
  const invoiceMatch: Record<string, unknown> = {
    ...companyScope(companyId),
    status: EXCLUDED_DOC_STATUS,
    product: { $exists: true, $ne: [] },
    ...customerMatch(party),
  };

  const rows = await InvoiceModel.aggregate([
    { $match: invoiceMatch },
    { $unwind: "$product" },
    { $group: { _id: "$product.product_id", amount: { $sum: "$product.amount" } } },
    {
      $lookup: {
        from: ProductModel.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
  ]);

  return rows.map((row) => ({
    id: row._id,
    name: row.product?.productName || "Unknown",
    amount: round2(row.amount),
  }));
};

const aggregateTopProductsFromPurchases = async (
  companyId: string,
  party: PartiesFilter | null,
  limit: number,
) => {
  const rows = await PurchaseInvoiceModel.aggregate([
    {
      $match: {
        ...companyScope(companyId),
        status: { $ne: "draft" },
        product: { $exists: true, $ne: [] },
        ...vendorMatch(party),
      },
    },
    { $unwind: "$product" },
    { $group: { _id: "$product.product_id", amount: { $sum: "$product.amount" } } },
    {
      $lookup: {
        from: ProductModel.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
  ]);

  return rows.map((row) => ({
    id: row._id,
    name: row.product?.productName || "Unknown",
    amount: round2(row.amount),
  }));
};

const buildTopProducts = async (companyId: string, party?: PartiesFilter | null, limit = 5) => {
  const merged = new Map<string, { id: unknown; name: string; amount: number }>();

  const addRows = (rows: { id: unknown; name: string; amount: number }[]) => {
    for (const row of rows) {
      const key = String(row.id);
      const prev = merged.get(key);
      if (prev) {
        prev.amount = round2(prev.amount + row.amount);
      } else {
        merged.set(key, { ...row });
      }
    }
  };

  if (!party || shouldIncludeCustomers(party)) {
    addRows(await aggregateTopProductsFromInvoices(companyId, party ?? null, limit));
  }
  if (party && shouldIncludeVendors(party)) {
    addRows(await aggregateTopProductsFromPurchases(companyId, party, limit));
  }

  return [...merged.values()].sort((a, b) => b.amount - a.amount).slice(0, limit);
};

const ACTIVITY_FETCH_CAP = 500;

const parseActivitiesPagination = (query: SummaryQuery) => {
  const page = Math.max(1, Number.parseInt(String(query.page ?? "1"), 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(String(query.limit ?? "10"), 10) || 10));
  return { page, limit };
};

const buildRecentActivities = async (
  companyId: string,
  party: PartiesFilter | null | undefined,
  actorEmail: string | undefined,
  page: number,
  limit: number,
) => {
  const companyOid = companyObjectId(companyId);
  const activities: {
    id: string;
    type: string;
    message: string;
    entity_name: string;
    email: string;
    created_at: string;
    sort_at: Date;
  }[] = [];

  const invoiceActivityQuery: Record<string, unknown> = {
    user_id: companyOid,
    ...customerMatch(party ?? null),
  };
  if (party && !shouldIncludeCustomers(party)) {
    invoiceActivityQuery._id = { $exists: false };
  }

  const [customers, vendors, trashedInvoices, archivedInvoices] = await Promise.all([
    UserModel.find(customerUserQuery(companyOid, party ?? null))
      .sort({ createdAt: -1 })
      .limit(ACTIVITY_FETCH_CAP)
      .select("name email createdAt")
      .lean(),
    UserModel.find(vendorUserQuery(companyOid, party ?? null))
      .sort({ createdAt: -1 })
      .limit(ACTIVITY_FETCH_CAP)
      .select("name email createdAt")
      .lean(),
    InvoiceModel.find({ ...invoiceActivityQuery, isDeleted: true })
      .sort({ updatedAt: -1 })
      .limit(ACTIVITY_FETCH_CAP)
      .select("invoice_number recipient_name sub_title updatedAt createdAt")
      .lean(),
    InvoiceModel.find({ ...invoiceActivityQuery, isDeleted: false, archive: true })
      .sort({ updatedAt: -1 })
      .limit(ACTIVITY_FETCH_CAP)
      .select("invoice_number recipient_name sub_title updatedAt createdAt")
      .lean(),
  ]);

  for (const c of customers) {
    const name = c.name || "Customer";
    activities.push({
      id: String(c._id),
      type: "customer_created",
      message: `New Customer ${name} created.`,
      entity_name: name,
      email: c.email || actorEmail || "",
      created_at: fmtActivityDate(c.createdAt),
      sort_at: c.createdAt ? new Date(c.createdAt) : new Date(),
    });
  }

  for (const v of vendors) {
    const name = v.name || "Vendor";
    activities.push({
      id: String(v._id),
      type: "vendor_created",
      message: `New Vendor ${name} created.`,
      entity_name: name,
      email: v.email || actorEmail || "",
      created_at: fmtActivityDate(v.createdAt),
      sort_at: v.createdAt ? new Date(v.createdAt) : new Date(),
    });
  }

  for (const inv of trashedInvoices) {
    const row = inv as any;
    const name = row.recipient_name || row.sub_title || row.invoice_number || "Invoice";
    const at = row.updatedAt || row.createdAt;
    activities.push({
      id: String(row._id),
      type: "trashed",
      message: `${name} trashed.`,
      entity_name: name,
      email: actorEmail || "",
      created_at: fmtActivityDate(at),
      sort_at: at ? new Date(at) : new Date(),
    });
  }

  for (const inv of archivedInvoices) {
    const row = inv as any;
    const name = row.recipient_name || row.sub_title || row.invoice_number || "Invoice";
    const at = row.updatedAt || row.createdAt;
    activities.push({
      id: String(row._id),
      type: "archived",
      message: `${name} archived.`,
      entity_name: name,
      email: actorEmail || "",
      created_at: fmtActivityDate(at),
      sort_at: at ? new Date(at) : new Date(),
    });
  }

  const sorted = activities
    .sort((a, b) => b.sort_at.getTime() - a.sort_at.getTime())
    .map(({ sort_at: _sortAt, ...rest }) => rest);

  const totalData = sorted.length;
  const start = (page - 1) * limit;
  const records = sorted.slice(start, start + limit);

  return {
    records,
    pagination: paginationBuilder({ totalData, currentPage: page, limit }),
  };
};

const getDashboard = async (req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  const query = req.query as SummaryQuery;
  const queryRecord = query as Record<string, unknown>;
  const range = resolveDateRange(query);
  const granularity = resolveGranularity(query.granularity);
  const currency = typeof query.currency === "string" ? query.currency : undefined;
  const roleScope = parseSummaryRoleScope(queryRecord);
  const party = await resolvePartiesFilter(companyId, parseUserIds(queryRecord), roleScope);
  const { page, limit } = parseActivitiesPagination(query);

  const [stats, chart, topCustomers, topProducts, recentActivities] = await Promise.all([
    buildStats(companyId, range, currency, party),
    buildChart(companyId, range, granularity, currency, party),
    buildTopCustomers(companyId, party),
    buildTopProducts(companyId, party),
    buildRecentActivities(companyId, party, req.user?.email, page, limit),
  ]);

  return {
    period: range.label,
    role: roleScope ?? "all",
    user_ids: party ? party.users.map((u) => u.id) : [],
    users: party?.users ?? [],
    date_range: {
      from: range.from.toISOString(),
      to: range.to.toISOString(),
    },
    stats,
    chart,
    topCustomers,
    topProducts,
    recentActivities,
  };
};

type ContactRole = typeof role.customer | typeof role.vendor;

const DOC_STATUS_EXCLUDED = { $nin: ["Draft", "Void"] };

const resolveContactRole = (value: unknown): ContactRole => {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  if (raw === "customer" || raw === "client") return role.customer;
  if (raw === "vendor") return role.vendor;
  throw new AppError(httpStatus.BAD_REQUEST, "role is required and must be customer or vendor");
};

const parseContactCreatedAtFilter = (query: Record<string, unknown>) => {
  const startRaw = query.startDate ?? query.from;
  const endRaw = query.endDate ?? query.to;
  const startStr = typeof startRaw === "string" ? startRaw.trim() : "";
  const endStr = typeof endRaw === "string" ? endRaw.trim() : "";

  if (!startStr && !endStr) return undefined;

  const createdAt: Record<string, Date> = {};
  if (startStr) {
    const start = startOfDay(new Date(startStr));
    if (Number.isNaN(start.getTime())) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid startDate");
    }
    createdAt.$gte = start;
  }
  if (endStr) {
    const end = endOfDay(new Date(endStr));
    if (Number.isNaN(end.getTime())) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid endDate");
    }
    createdAt.$lte = end;
  }
  return createdAt;
};

const buildContactPartyFilter = (companyId: string, partyRole: ContactRole) => {
  const companyOid = companyObjectId(companyId);
  if (partyRole === role.customer) {
    return {
      companyId: companyOid,
      role: { $in: [...CUSTOMER_ROLE_VALUES] },
      isDeleted: false,
    };
  }
  return {
    companyId: companyOid,
    role: role.vendor,
    isDeleted: false,
  };
};

const buildPartyListQuery = (
  companyId: string,
  partyRole: ContactRole,
  query: Record<string, unknown>,
) => {
  const listQuery = { ...query };
  delete listQuery.role;
  delete listQuery.startDate;
  delete listQuery.endDate;
  delete listQuery.from;
  delete listQuery.to;

  const createdAt = parseContactCreatedAtFilter(query);
  const baseFilter = {
    ...buildContactPartyFilter(companyId, partyRole),
    ...(createdAt ? { createdAt } : {}),
  };

  const qb = new queryBuilder(
    UserModel.find(baseFilter).select("name email phone businessProfile.companyName createdAt"),
    listQuery,
  )
    .search([...PARTY_SEARCH_FIELDS])
    .filter()
    .sort();

  return { qb, baseFilter };
};

const fetchCustomerBalanceMap = async (companyId: string) => {
  const rows = await InvoiceModel.aggregate<{ _id: Types.ObjectId; amount: number }>([
    {
      $match: {
        user_id: companyObjectId(companyId),
        isDeleted: false,
        archive: false,
        status: DOC_STATUS_EXCLUDED,
        customer_id: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$customer_id",
        amount: { $sum: { $ifNull: ["$balance_amount", 0] } },
      },
    },
  ]);

  return new Map(rows.map((row) => [String(row._id), round2(row.amount)]));
};

const fetchVendorBalanceMap = async (companyId: string) => {
  const scope = companyScope(companyId);
  const [billRows, purchaseRows] = await Promise.all([
    BillModel.aggregate<{ _id: Types.ObjectId; amount: number }>([
      {
        $match: {
          ...scope,
          isDeleted: false,
          archive: false,
          status: DOC_STATUS_EXCLUDED,
          vendor_id: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$vendor_id",
          amount: { $sum: { $ifNull: ["$balance_amount", 0] } },
        },
      },
    ]),
    PurchaseInvoiceModel.aggregate<{ _id: Types.ObjectId; amount: number }>([
      {
        $match: {
          ...scope,
          isDeleted: false,
          status: { $nin: ["draft"] },
          vendor_id: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$vendor_id",
          amount: { $sum: { $ifNull: ["$balance_amount", 0] } },
        },
      },
    ]),
  ]);

  const map = new Map<string, number>();
  for (const row of [...billRows, ...purchaseRows]) {
    const id = String(row._id);
    map.set(id, round2((map.get(id) ?? 0) + row.amount));
  }
  return map;
};

const fetchBalanceMap = (companyId: string, partyRole: ContactRole) =>
  partyRole === role.customer
    ? fetchCustomerBalanceMap(companyId)
    : fetchVendorBalanceMap(companyId);

const getContacts = async (req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  const partyRole = resolveContactRole(req.query.role);
  const query = { ...(req.query as Record<string, unknown>) };

  const { qb, baseFilter } = buildPartyListQuery(companyId, partyRole, query);
  const { totalData } = await qb.paginate(UserModel.find(baseFilter));

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = qb.calculatePagination({ totalData, currentPage: page, limit });

  const [users, allFilteredUsers, balanceMap] = await Promise.all([
    qb.modelQuery.exec(),
    buildPartyListQuery(companyId, partyRole, query).qb.modelQuery.select("_id").lean(),
    fetchBalanceMap(companyId, partyRole),
  ]);

  const records = users.map((user) => {
    const doc = typeof user.toObject === "function" ? user.toObject() : user;
    return {
      _id: doc._id,
      company_name: doc.businessProfile?.companyName ?? null,
      name: doc.name ?? null,
      amount: balanceMap.get(String(doc._id)) ?? 0,
      createdAt: doc.createdAt,
    };
  });

  const totalDue = round2(
    allFilteredUsers.reduce((sum, user) => sum + (balanceMap.get(String(user._id)) ?? 0), 0),
  );

  return {
    role: partyRole === role.customer ? "customer" : "vendor",
    records,
    pagination,
    summary: {
      totalDue,
      totalContacts: totalData,
    },
  };
};

export const summaryDashboardService = { getDashboard, getContacts };
