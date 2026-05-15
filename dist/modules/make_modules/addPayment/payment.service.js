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
exports.addPaymentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const customer_model_1 = require("../customer/customer.model");
const payment_model_1 = require("./payment.model");
const invoice_management_model_1 = require("../invoiceManagement/invoice.management.model");
const queryBuilder_1 = __importDefault(require("../../../builder/queryBuilder"));
const paymentCreateDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_model_1.CustomerModel.findById(payload.customer_id);
    if (!customer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
    }
    if (payload.type === "invoice") {
        const invoice = yield invoice_management_model_1.InvoiceManagementModel.findById(payload.invoice_id);
        if (!invoice) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Invoice not found");
        }
    }
    const result = yield payment_model_1.PaymentModel.create(payload);
    return result;
});
const paymentGetAllDB = (query, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentQuery = new queryBuilder_1.default(payment_model_1.PaymentModel.find({ user_id, isActive: true, isDeleted: false, isArchive: false }), query).search(["payment_type", "notes", "internal_notes"]).filter().sort().fields();
    const { totalData } = yield paymentQuery.paginate(payment_model_1.PaymentModel.find({ user_id, isActive: true, isDeleted: false, isArchive: false }));
    const allPayment = yield paymentQuery.modelQuery.exec();
    const currentPage = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = paymentQuery.calculatePagination({ totalData, currentPage, limit });
    return { allPayment, pagination };
});
const paymentSingleDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.PaymentModel.findOne({ _id: id, isActive: true, isDeleted: false, isArchive: false
    });
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
    }
    return payment;
});
const paymentUpdateDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.PaymentModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
    }
    return payment;
});
const paymentDeleteDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.PaymentModel.findByIdAndDelete(id);
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
    }
});
exports.addPaymentService = {
    paymentCreateDB,
    paymentGetAllDB,
    paymentSingleDB,
    paymentUpdateDB,
    paymentDeleteDB,
};
