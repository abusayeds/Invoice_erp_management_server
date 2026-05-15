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
exports.customerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const queryBuilder_1 = __importDefault(require("../../../builder/queryBuilder"));
const customer_model_1 = require("./customer.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const customerCreateDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield customer_model_1.CustomerModel.create(payload);
    return res;
});
const allCustomerDB = (user_id, query) => __awaiter(void 0, void 0, void 0, function* () {
    const customerQuery = new queryBuilder_1.default(customer_model_1.CustomerModel.find({ user_id: user_id, active: true, archive: false, isDeleted: false }), query)
        .search([
        "companyName",
        "firstName",
        "lastName",
        "lastName",
        "BusinessPhone",
        "fax",
        "bank_details",
        "currency",
        "tax_service",
        "tax_product",
    ])
        .filter()
        .sort()
        .fields();
    const { totalData } = yield customerQuery.paginate(customer_model_1.CustomerModel.find({ user_id: user_id, active: true, archive: false, isDeleted: false }));
    const allCustomer = yield customerQuery.modelQuery.exec();
    const currentPage = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = customerQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });
    return { allCustomer, pagination };
});
const singleCustomerDB = (user_id, _id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield customer_model_1.CustomerModel.findOne({ user_id, _id, active: true, archive: false, isDeleted: false });
    return res;
});
const deleteCustomerDB = (user_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield customer_model_1.CustomerModel.findOneAndUpdate({ user_id, _id: payload._id }, payload, { new: true });
    return res;
});
const updateCustomerDB = (user_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield customer_model_1.CustomerModel.findOneAndUpdate({ user_id, _id: payload._id }, payload, { new: true });
    if (!res) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
    }
    return res;
});
exports.customerService = {
    customerCreateDB,
    allCustomerDB,
    singleCustomerDB,
    deleteCustomerDB,
    updateCustomerDB
};
