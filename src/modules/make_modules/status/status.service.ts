import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
} from "date-fns";
import queryBuilder from "../../../builder/queryBuilder";
import { TPayment } from "../addPayment/payment.interface";
import { PaymentModel } from "../addPayment/payment.model";
import { CustomerModel } from "../customer/customer.model";
import {
  InvoiceManagementType,
  TInvoiceManagement,
} from "../invoiceManagement/invoice.management.interface";
import { InvoiceManagementModel } from "../invoiceManagement/invoice.management.model";
import { Types } from "mongoose";

// const getStatusDataDB = async (user_id : string , query: Record<string, unknown>) => {
//     const allCustomerQuery =   new queryBuilder(CustomerModel.find({ user_id: user_id }) , query).filter()
//     const allCustomer = await allCustomerQuery.modelQuery.exec()

//     const allDraftInvoices = await Promise.all(allCustomer.map(async (customer) => {
//     const draftInvoices = await InvoiceManagementModel.find({customer_id: customer._id, user_id: user_id, type :InvoiceManagementType.Invoice ,status: "Draft",}) as TInvoiceManagement[];
//     return draftInvoices.reduce((acc, invoice) => acc + invoice.total,0)}));

//     const allEstimateInvoices = await Promise.all(allCustomer.map(async (customer) => {
//     const estimateInvoices = await InvoiceManagementModel.find({customer_id: customer._id, user_id: user_id, type :InvoiceManagementType.Estimate ,}) as TInvoiceManagement[];
//     return estimateInvoices.reduce((acc, estimate) => acc + estimate.total,0)}));

//     const allSalesInvoices = await Promise.all(allCustomer.map(async (customer) => {
//     const salesInvoices = await InvoiceManagementModel.find({customer_id: customer._id, user_id: user_id, type :InvoiceManagementType.Invoice ,status: "Paid",}) as TInvoiceManagement[];
//     return salesInvoices.reduce((acc, sales) => acc + sales.total,0)}));

//     const allSales_Receipt= await Promise.all(allCustomer.map(async (customer) => {
//     const Sales_Receipt= await InvoiceManagementModel.find({customer_id: customer._id, user_id: user_id, type :InvoiceManagementType.Sales_Receipt ,}) as TInvoiceManagement[];
//     return Sales_Receipt.reduce((acc, receipt) => acc + receipt.total,0)}));

//     const allPayment = await Promise.all(allCustomer.map(async (customer) => {
//     const payments = await PaymentModel.find({customer_id: customer._id, user_id: user_id}) as TPayment[];
//     return payments.reduce((acc, payment) => acc + payment.amount,0)}));

//     const DraftInvoices = allDraftInvoices.reduce((acc, val) => acc + val, 0);
//     const EstimateInvoices = allEstimateInvoices.reduce((acc, val) => acc + val, 0);
//     const Payments = allPayment.reduce((acc, val) => acc + val, 0);
//     const Seles = allSalesInvoices.reduce((acc, val) => acc + val, 0) + allSales_Receipt.reduce((acc, val) => acc + val, 0);
//  return {
//     DraftInvoices,
//     EstimateInvoices,
//     Payments ,
//     Sales : Seles,
//     Profit : Seles ,
//     Outstanding : Number(Seles - Payments).toFixed(2),
//  }
// };

const getStatusDataDB = async (
  user_id: string,
  query: Record<string, unknown>,
  date: string,
) => {
  const dateFilter: Record<string, unknown> = {};
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    dateFilter.createdAt = { $gte: startDate, $lte: endDate };
  }
  const allCustomerQuery = new queryBuilder(
    CustomerModel.find({ user_id: user_id }),
    query,
  ).filter();
  const allCustomers = await allCustomerQuery.modelQuery.exec();

  const customerIds = allCustomers.map((c) => c._id);

  if (customerIds.length === 0) {
    return {
      DraftInvoices: 0,
      EstimateInvoices: 0,
      Payments: 0,
      Sales: 0,
      Profit: 0,
      Outstanding: 0.0,
    };
  }

  const invoiceAgg = await InvoiceManagementModel.aggregate([
    {
      $match: {
        user_id,
        customer_id: { $in: customerIds },
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: { type: "$type", status: "$status" },
        total: { $sum: "$total" },
      },
    },
  ]);

  const paymentAgg = await PaymentModel.aggregate([
    {
      $match: {
        user_id,
        customer_id: { $in: customerIds },
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  let DraftInvoices = 0;
  let EstimateInvoices = 0;
  let SalesInvoices = 0;
  let SalesReceipt = 0;

  for (const row of invoiceAgg) {
    const { type, status } = row._id;

    if (type === InvoiceManagementType.Invoice && status === "Draft") {
      DraftInvoices = row.total;
    } else if (type === InvoiceManagementType.Estimate) {
      EstimateInvoices = row.total;
    } else if (type === InvoiceManagementType.Invoice && status === "Paid") {
      SalesInvoices = row.total;
    } else if (type === InvoiceManagementType.Sales_Receipt) {
      SalesReceipt = row.total;
    }
  }

  const Payments = paymentAgg[0]?.total ?? 0;
  const Sales = SalesInvoices + SalesReceipt;
  const Outstanding = Number(Sales - Payments).toFixed(2);

  return {
    DraftInvoices,
    EstimateInvoices,
    Payments,
    Sales,
    Profit: Sales,
    Outstanding,
  };
};
// const graphChartDB = async (user_id : string , query: Record<string, unknown>) => {
//      if(query?.type === "Sales"){
//       const salesInvoices = await InvoiceManagementModel.find({ user_id: user_id, type :InvoiceManagementType.Invoice ,status: "Paid",}) as TInvoiceManagement[];
//       const salesData =  salesInvoices.reduce((acc, sales) => acc + sales.total,0)
//      }  else if(query?.type === "Payments"){
//       const payments = await PaymentModel.find({ user_id: user_id}) as TPayment[];
//       const paymentData =  payments.reduce((acc, payment) => acc + payment.amount,0)
//      }
// };

const graphChartDB = async (
  user_id: string,
  query: Record<string, unknown>,
) => {
  const period = query?.period as string; // "days" | "weeks" | "months" | "years"
  const now = new Date();

  // ─── Date Range Builder ───────────────────────────────────────────
  const getDateRange = () => {
    switch (period) {
      case "days":
        return {
          start: startOfDay(subDays(now, 9)), // last 10 days
          end: endOfDay(now),
        };
      case "weeks":
      case "months":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
        };
      case "years":
        return {
          start: startOfYear(now),
          end: endOfYear(now),
        };
      default:
        return { start: startOfDay(now), end: endOfDay(now) };
    }
  };

  const { start, end } = getDateRange();

  // ─── Group Data by Period ─────────────────────────────────────────
  const groupDataByPeriod = (
    items: { date: Date; amount: number }[],
  ): { label: string; total: number }[] => {
    switch (period) {
      case "days": {
        const days = eachDayOfInterval({ start, end }); // 10 days interval
        return days.map((day) => ({
          label: format(day, "MMM dd"),
          total: items
            .filter(
              (item) =>
                item.date >= startOfDay(day) && item.date <= endOfDay(day),
            )
            .reduce((acc, item) => acc + item.amount, 0),
        }));
      }

      case "weeks": {
        const weeks = eachWeekOfInterval(
          { start, end },
          { weekStartsOn: 0 }, // 0 = Sunday
        );
        return weeks.map((weekStart, i) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
          return {
            label: `Week ${i + 1}`,
            total: items
              .filter((item) => item.date >= weekStart && item.date <= weekEnd)
              .reduce((acc, item) => acc + item.amount, 0),
          };
        });
      }

      case "months": {
        // Current month এর total
        return [
          {
            label: format(now, "MMMM yyyy"),
            total: items.reduce((acc, item) => acc + item.amount, 0),
          },
        ];
      }

      case "years": {
        // Current year এর total
        return [
          {
            label: format(now, "yyyy"),
            total: items.reduce((acc, item) => acc + item.amount, 0),
          },
        ];
      }

      default:
        return [];
    }
  };

  // ─── Sales ────────────────────────────────────────────────────────
  if (query?.type === "Sales") {
    const salesInvoices = (await InvoiceManagementModel.find({
      user_id,
      type: InvoiceManagementType.Invoice,
      status: "Paid",
      createdAt: { $gte: start, $lte: end },
    })) as TInvoiceManagement[];

    const mapped = salesInvoices.map((inv: any) => ({
      date: new Date(inv.createdAt),
      amount: inv.total,
    }));

    return groupDataByPeriod(mapped);
  }

  // ─── Payments ─────────────────────────────────────────────────────
  else if (query?.type === "Payments") {
    const payments = (await PaymentModel.find({
      user_id,
      createdAt: { $gte: start, $lte: end },
    })) as TPayment[];

    const mapped = payments.map((payment: any) => ({
      date: new Date(payment.createdAt),
      amount: payment.amount,
    }));

    return groupDataByPeriod(mapped);
  }
};
const topCustomerDB = async (user_id: string) => {
  const result = await PaymentModel.aggregate([
    // Step 1: Match payments for this user that are active and not deleted
    {
      $match: {
        user_id: new Types.ObjectId(user_id),
        isDeleted: false,
        isActive: true,
      },
    },

    // Step 2: Group by customer_id and sum their total payments
    {
      $group: {
        _id: "$customer_id",
        totalPayment: { $sum: "$amount" },
        paymentCount: { $sum: 1 },
      },
    },

    // Step 3: Sort by totalPayment descending (highest first)
    {
      $sort: { totalPayment: -1 },
    },

    // Step 4: Take only top 5
    {
      $limit: 5,
    },

    // Step 5: Populate customer details
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customerInfo",
      },
    },

    // Step 6: Flatten the customerInfo array
    {
      $unwind: "$customerInfo",
    },

    // Step 7: Shape the final output
  {
  $project: {
    _id: 0,
    customer_id: "$_id",
    totalPayment: 1,
    paymentCount: 1,
    "customerInfo.firstName": 1,
    "customerInfo.lastName": 1,
    "customerInfo.email": 1,
    "customerInfo.companyName": 1,
  },
},
  ]);

  return result;
};

const topProductsDB = async (user_id: string) => {
  const result = await InvoiceManagementModel.aggregate([
    // Step 1: Match invoices for this user, not deleted
    {
      $match: {
        user_id: new Types.ObjectId(user_id),
        isDeleted: false,
      },
    },

    // Step 2: Unwind product array - each product আলাদা document হবে
    {
      $unwind: "$product",
    },

    // Step 3: Group by product_id, quantity ও amount যোগ করো
    {
      $group: {
        _id: "$product.product_id",
        totalQuantity: { $sum: "$product.quantity" },
        totalAmount: { $sum: "$product.amount" },
        usageCount: { $sum: 1 }, // কতটা invoice তে use হয়েছে
      },
    },

    // Step 4: Sort by totalQuantity descending
    {
      $sort: { totalQuantity: -1 },
    },

    // Step 5: Top 5 নাও
    {
      $limit: 5,
    },

    // Step 6: Product collection থেকে details আনো
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productInfo",
      },
    },

    // Step 7: Flatten
    {
      $unwind: "$productInfo",
    },

    // Step 8: Clean output
    {
      $project: {
        _id: 0,
        product_id: "$_id",
        totalQuantity: 1,
        totalAmount: 1,
        usageCount: 1,
        "productInfo.productName": 1,
      },
    },
  ]);

  return result;
};
export const statusService = {
  getStatusDataDB,
  graphChartDB,
  topCustomerDB,
  topProductsDB,
};
