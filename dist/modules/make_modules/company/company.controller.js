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
exports.companyController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const company_service_1 = require("./company.service");
const activities_service_1 = require("../activities/activities.service");
const activities_interface_1 = require("../activities/activities.interface");
// Create
const createCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.user_id = req.user._id;
    const result = yield company_service_1.companyService.createCompany(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Company created successfully.",
        data: result,
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, title: ` ${result.businessName} Company Created`, type: activities_interface_1.ActivitiesType.Created });
}));
// Get All
const getAllCompanies = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_service_1.companyService.getAllCompanies();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Companies retrieved successfully.",
        data: result,
    });
}));
// Get Single
const getSingleCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield company_service_1.companyService.getSingleCompany(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Company retrieved successfully.",
        data: result,
    });
}));
// Update
const updateCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const result = yield company_service_1.companyService.updateCompany(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Company updated successfully.",
        data: result,
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, type: activities_interface_1.ActivitiesType.Updated, title: ` ${result === null || result === void 0 ? void 0 : result.businessName} Company Updated` });
}));
// Delete
const deleteCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const result = yield company_service_1.companyService.deleteCompany(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Company deleted successfully.",
        data: result,
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, type: activities_interface_1.ActivitiesType.Archived, title: ` ${result === null || result === void 0 ? void 0 : result.businessName} Company Deleted` });
}));
exports.companyController = {
    createCompany,
    getAllCompanies,
    getSingleCompany,
    updateCompany,
    deleteCompany,
};
