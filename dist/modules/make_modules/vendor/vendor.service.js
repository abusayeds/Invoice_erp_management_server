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
exports.vendorService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const queryBuilder_1 = __importDefault(require("../../../builder/queryBuilder"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const vendor_model_1 = require("./vendor.model");
const vendorCreateDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield vendor_model_1.VendorModel.create(payload);
    return res;
});
const allVendorDB = (user_id, query) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorQuery = new queryBuilder_1.default(vendor_model_1.VendorModel.find({ user_id: user_id, active: true, archive: false, isDeleted: false }), query)
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
        .sort();
    const { totalData } = yield vendorQuery.paginate(vendor_model_1.VendorModel.find({ user_id: user_id, active: true, archive: false, isDeleted: false }));
    const allVendor = yield vendorQuery.modelQuery.exec();
    const currentPage = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = vendorQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });
    return { allVendor, pagination };
});
const singleVendorDB = (user_id, _id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield vendor_model_1.VendorModel.findOne({ user_id, _id, active: true, archive: false, isDeleted: false });
    return res;
});
const deleteVendorDB = (user_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield vendor_model_1.VendorModel.findOneAndUpdate({ user_id, _id: payload._id }, payload, { new: true });
    return res;
});
const updateVendorDB = (user_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield vendor_model_1.VendorModel.findOneAndUpdate({ user_id, _id: payload._id }, payload, { new: true });
    if (!res) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Vendor not found");
    }
    return res;
});
exports.vendorService = {
    vendorCreateDB,
    allVendorDB,
    singleVendorDB,
    deleteVendorDB,
    updateVendorDB
};
