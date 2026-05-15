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
exports.invoiceManagementService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const customer_model_1 = require("../customer/customer.model");
const invoice_management_interface_1 = require("./invoice.management.interface");
const product_model_1 = require("../product/product.model");
const service_model_1 = require("../service/service.model");
const calculateInvoice_1 = require("./calculateInvoice");
const validateItemAmount_1 = require("./validateItemAmount");
const invoice_management_model_1 = require("./invoice.management.model");
const queryBuilder_1 = __importDefault(require("../../../builder/queryBuilder"));
const invoiceManagementCreateDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCustomerExist = yield customer_model_1.CustomerModel.findById(payload.customer_id);
    if (!isCustomerExist) {
        throw new AppError_1.default(http_status_1.default.NOT_EXTENDED, "Customer not found");
    }
    const allowedTypes = Object.values(invoice_management_interface_1.InvoiceManagementType);
    if (!payload.type) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invoice type is required. Allowed types: ${allowedTypes.join(", ")}`);
    }
    if (!allowedTypes.includes(payload.type)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invalid invoice type. Allowed types: ${allowedTypes.join(", ")}`);
    }
    if (Array.isArray(payload.product)) {
        for (const item of payload.product) {
            const product = (yield product_model_1.ProductModel.findById(item.product_id));
            if (!product) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found with id: ${item.product_id}`);
            }
            if (product.pricing.sellPrice !== item.rate) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Product rate mismatch ${item.product_id}: ${product.pricing.sellPrice} vs ${item.rate}`);
            }
            (0, validateItemAmount_1.validateItemAmount)(item, "product");
        }
    }
    if (Array.isArray(payload.service)) {
        for (const item of payload.service) {
            const service = (yield service_model_1.ServiceModel.findById(item.service_id));
            if (!service) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Service not found with id: ${item.service_id}`);
            }
            if (service.rate !== item.rate) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Service rate mismatch ${item.service_id}:  ${service.rate} vs ${item.rate}`);
            }
            (0, validateItemAmount_1.validateItemAmount)(item, "service");
        }
    }
    const result = yield (0, calculateInvoice_1.calculateInvoice)(payload);
    const invoiceData = Object.assign(Object.assign({}, payload), result);
    const createdInvoice = yield invoice_management_model_1.InvoiceManagementModel.create(invoiceData);
    return createdInvoice;
});
const invoiceManagementGetSingleDB = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const invoice = yield invoice_management_model_1.InvoiceManagementModel.findOne({
        _id: id,
        user_id: userId,
        archive: false,
        isDeleted: false,
    });
    if (!invoice) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Invoice not found");
    }
    return invoice;
});
const invoiceManagementGetAllDB = (query, user_id, type) => __awaiter(void 0, void 0, void 0, function* () {
    const invoicesQuery = new queryBuilder_1.default(invoice_management_model_1.InvoiceManagementModel.find({
        type,
        user_id: user_id,
        archive: false,
        isDeleted: false,
    }).populate({
        path: "customer_id",
        select: "firstName lastName",
    }), query)
        .search([
        "internal_notes",
        "notes",
        "terms_and_conditions",
        "invoice_number",
        "sub_title",
    ])
        .filter()
        .sort()
        .fields();
    const { totalData } = yield invoicesQuery.paginate(invoice_management_model_1.InvoiceManagementModel.find({
        type,
        user_id: user_id,
        archive: false,
        isDeleted: false,
    }));
    const allInvoice = yield invoicesQuery.modelQuery.exec();
    const currentPage = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = invoicesQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });
    return { allInvoice, pagination };
});
exports.invoiceManagementService = {
    invoiceManagementCreateDB,
    invoiceManagementGetSingleDB,
    invoiceManagementGetAllDB,
};
