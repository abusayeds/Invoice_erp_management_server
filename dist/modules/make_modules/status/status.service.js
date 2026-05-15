"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusService = void 0;
const date_fns_1 = require("date-fns");
const queryBuilder_1 = __importDefault(require("../../../builder/queryBuilder"));
const payment_model_1 = require("../addPayment/payment.model");
const customer_model_1 = require("../customer/customer.model");
const invoice_management_interface_1 = require("../invoiceManagement/invoice.management.interface");
const invoice_management_model_1 = require("../invoiceManagement/invoice.management.model");
const mongoose_1 = require("mongoose");
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
const getStatusDataDB = (user_id, query, startDate) => __awaiter(void 0, void 0, void 0, function* () {
    let dateFilter = {};
    if (startDate) {
        const parsedDate = new Date(startDate);
        if (!isNaN(parsedDate.getTime())) {
            dateFilter = {
                createdAt: {
                    $gte: parsedDate,
                    $lte: new Date(),
                },
            };
        }
    }
    const allCustomerQuery = new queryBuilder_1.default(customer_model_1.CustomerModel.find({ user_id }), query).filter();
    const allCustomer = yield allCustomerQuery.modelQuery.exec();
    const allData = yield Promise.all(allCustomer.map((customer) => __awaiter(void 0, void 0, void 0, function* () {
        const baseFilter = Object.assign({ customer_id: customer._id, user_id }, dateFilter);
        const [draftInvoices, estimateInvoices, salesInvoices, salesReceipts, payments] = yield Promise.all([
            invoice_management_model_1.InvoiceManagementModel.find(Object.assign(Object.assign({}, baseFilter), { type: invoice_management_interface_1.InvoiceManagementType.Invoice, status: "Draft" })),
            invoice_management_model_1.InvoiceManagementModel.find(Object.assign(Object.assign({}, baseFilter), { type: invoice_management_interface_1.InvoiceManagementType.Estimate })),
            invoice_management_model_1.InvoiceManagementModel.find(Object.assign(Object.assign({}, baseFilter), { type: invoice_management_interface_1.InvoiceManagementType.Invoice, status: "Paid" })),
            invoice_management_model_1.InvoiceManagementModel.find(Object.assign(Object.assign({}, baseFilter), { type: invoice_management_interface_1.InvoiceManagementType.Sales_Receipt })),
            payment_model_1.PaymentModel.find(baseFilter),
        ]);
        return {
            draft: draftInvoices.reduce((acc, inv) => acc + inv.total, 0),
            estimate: estimateInvoices.reduce((acc, inv) => acc + inv.total, 0),
            sales: salesInvoices.reduce((acc, inv) => acc + inv.total, 0),
            receipts: salesReceipts.reduce((acc, rec) => acc + rec.total, 0),
            payments: payments.reduce((acc, pay) => acc + pay.amount, 0),
        };
    })));
    const totals = allData.reduce((acc, curr) => ({
        DraftInvoices: acc.DraftInvoices + curr.draft,
        EstimateInvoices: acc.EstimateInvoices + curr.estimate,
        Payments: acc.Payments + curr.payments,
        Sales: acc.Sales + curr.sales + curr.receipts,
    }), { DraftInvoices: 0, EstimateInvoices: 0, Payments: 0, Sales: 0 });
    return Object.assign(Object.assign({}, totals), { Profit: totals.Sales, Outstanding: Number(totals.Sales - totals.Payments).toFixed(2) });
});
const graphChartDB = (user_id, query) => __awaiter(void 0, void 0, void 0, function* () {
    const period = query === null || query === void 0 ? void 0 : query.period; // "days" | "weeks" | "months" | "years"
    const now = new Date();
    // ─── Date Range Builder ───────────────────────────────────────────
    const getDateRange = () => {
        switch (period) {
            case "days":
                return {
                    start: (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(now, 9)), // last 10 days
                    end: (0, date_fns_1.endOfDay)(now),
                };
            case "weeks":
            case "months":
                return {
                    start: (0, date_fns_1.startOfMonth)(now),
                    end: (0, date_fns_1.endOfMonth)(now),
                };
            case "years":
                return {
                    start: (0, date_fns_1.startOfYear)(now),
                    end: (0, date_fns_1.endOfYear)(now),
                };
            default:
                return { start: (0, date_fns_1.startOfDay)(now), end: (0, date_fns_1.endOfDay)(now) };
        }
    };
    const { start, end } = getDateRange();
    // ─── Group Data by Period ─────────────────────────────────────────
    const groupDataByPeriod = (items) => {
        switch (period) {
            case "days": {
                const days = (0, date_fns_1.eachDayOfInterval)({ start, end }); // 10 days interval
                return days.map((day) => ({
                    label: (0, date_fns_1.format)(day, "MMM dd"),
                    total: items
                        .filter((item) => item.date >= (0, date_fns_1.startOfDay)(day) && item.date <= (0, date_fns_1.endOfDay)(day))
                        .reduce((acc, item) => acc + item.amount, 0),
                }));
            }
            case "weeks": {
                const weeks = (0, date_fns_1.eachWeekOfInterval)({ start, end }, { weekStartsOn: 0 });
                return weeks.map((weekStart, i) => {
                    const weekEnd = (0, date_fns_1.endOfWeek)(weekStart, { weekStartsOn: 0 });
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
                        label: (0, date_fns_1.format)(now, "MMMM yyyy"),
                        total: items.reduce((acc, item) => acc + item.amount, 0),
                    },
                ];
            }
            case "years": {
                // Current year এর total
                return [
                    {
                        label: (0, date_fns_1.format)(now, "yyyy"),
                        total: items.reduce((acc, item) => acc + item.amount, 0),
                    },
                ];
            }
            default:
                return [];
        }
    };
    // ─── Sales ────────────────────────────────────────────────────────
    if ((query === null || query === void 0 ? void 0 : query.type) === "Sales") {
        const salesInvoices = (yield invoice_management_model_1.InvoiceManagementModel.find({
            user_id,
            type: invoice_management_interface_1.InvoiceManagementType.Invoice,
            status: "Paid",
            createdAt: { $gte: start, $lte: end },
        }));
        const mapped = salesInvoices.map((inv) => ({
            date: new Date(inv.createdAt),
            amount: inv.total,
        }));
        return groupDataByPeriod(mapped);
    }
    // ─── Payments ─────────────────────────────────────────────────────
    else if ((query === null || query === void 0 ? void 0 : query.type) === "Payments") {
        const payments = (yield payment_model_1.PaymentModel.find({
            user_id,
            createdAt: { $gte: start, $lte: end },
        }));
        const mapped = payments.map((payment) => ({
            date: new Date(payment.createdAt),
            amount: payment.amount,
        }));
        return groupDataByPeriod(mapped);
    }
});
const topCustomerDB = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.PaymentModel.aggregate([
        // Step 1: Match payments for this user that are active and not deleted
        {
            $match: {
                user_id: new mongoose_1.Types.ObjectId(user_id),
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
});
const topProductsDB = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield invoice_management_model_1.InvoiceManagementModel.aggregate([
        // Step 1: Match invoices for this user, not deleted
        {
            $match: {
                user_id: new mongoose_1.Types.ObjectId(user_id),
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
});
exports.statusService = {
    getStatusDataDB,
    graphChartDB,
    topCustomerDB,
    topProductsDB,
};
