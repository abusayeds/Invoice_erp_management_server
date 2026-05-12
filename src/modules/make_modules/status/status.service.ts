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
import { InvoiceModel } from "../invoice/invoice.model";
import { EstimateModel } from "../estimate/estimate.model";
import { SalesReceiptModel } from "../salesReceipt/salesReceipt.model";
import { TInvoice } from "../invoice/invoice.interface";
import { TEstimate } from "../estimate/estimate.interface";
import { TSalesReceipt } from "../salesReceipt/salesReceipt.interface";
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
  query: Record<string, unknown> ,
  startDate?: string
) => {
  let dateFilter = {};
  if (startDate) {
    const parsedDate = new Date(startDate as string);
    if (!isNaN(parsedDate.getTime())) {
      dateFilter = {
        createdAt: {
          $gte: parsedDate,
          $lte: new Date(),
        },
      };
    }
  }

  const allCustomerQuery = new queryBuilder(
    CustomerModel.find({ user_id }),
    query
  ).filter();
  const allCustomer = await allCustomerQuery.modelQuery.exec();
  const allData = await Promise.all(
    allCustomer.map(async (customer) => {
      const baseFilter = { customer_id: customer._id, user_id, ...dateFilter };

      const [draftInvoices, estimateInvoices, salesInvoices, salesReceipts, payments] =
        await Promise.all([
          InvoiceModel.find({
            ...baseFilter,
            status: "Draft",
          }) as Promise<TInvoice[]>,

          EstimateModel.find({
            ...baseFilter,
          }) as Promise<TEstimate[]>,

          InvoiceModel.find({
            ...baseFilter,
            status: "Paid",
          }) as Promise<TInvoice[]>,

          SalesReceiptModel.find({
            ...baseFilter,
          }) as Promise<TSalesReceipt[]>,

          PaymentModel.find(baseFilter) as Promise<TPayment[]>,
        ]);

      return {
        draft:     draftInvoices.reduce((acc, inv) => acc + inv.total, 0),
        estimate:  estimateInvoices.reduce((acc, inv) => acc + inv.total, 0),
        sales:     salesInvoices.reduce((acc, inv) => acc + inv.total, 0),
        receipts:  salesReceipts.reduce((acc, rec) => acc + rec.total, 0),
        payments:  payments.reduce((acc, pay) => acc + pay.amount, 0),
      };
    })
  );
  const totals = allData.reduce(
    (acc, curr) => ({
      DraftInvoices:    acc.DraftInvoices + curr.draft,
      EstimateInvoices: acc.EstimateInvoices + curr.estimate,
      Payments:         acc.Payments + curr.payments,
      Sales:            acc.Sales + curr.sales + curr.receipts,
    }),
    { DraftInvoices: 0, EstimateInvoices: 0, Payments: 0, Sales: 0 }
  );

  return {
    ...totals,
    Profit:      totals.Sales,
    Outstanding: Number(totals.Sales - totals.Payments).toFixed(2),
  };
};
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
    const salesInvoices = (await InvoiceModel.find({
      user_id,
      status: "Paid",
      createdAt: { $gte: start, $lte: end },
    })) as TInvoice[];

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
  const result = await InvoiceModel.aggregate([
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
