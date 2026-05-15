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
exports.companyService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const company_model_1 = require("./company.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
// Create
const createCompany = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.Company.create(payload);
    return result;
});
// Get All
const getAllCompanies = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.Company.find();
    return result;
});
// Get Single
const getSingleCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.Company.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Company not found");
    }
    return result;
});
// Update
const updateCompany = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield company_model_1.Company.findById(id);
    if (!exists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Company not found");
    }
    const result = yield company_model_1.Company.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    return result;
});
// Delete
const deleteCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield company_model_1.Company.findById(id);
    if (!exists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Company not found");
    }
    const result = yield company_model_1.Company.findByIdAndDelete(id);
    return result;
});
exports.companyService = {
    createCompany,
    getAllCompanies,
    getSingleCompany,
    updateCompany,
    deleteCompany,
};
