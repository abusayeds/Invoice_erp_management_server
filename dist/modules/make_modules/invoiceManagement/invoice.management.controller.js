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
exports.invoiceManagementController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const invoice_management_service_1 = require("./invoice.management.service");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const invoice_management_interface_1 = require("./invoice.management.interface");
const activities_interface_1 = require("../activities/activities.interface");
const activities_service_1 = require("../activities/activities.service");
const invoiceManagementCreate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    req.body.user_id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield invoice_management_service_1.invoiceManagementService.invoiceManagementCreateDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: " InvoiceManagement created successfully.",
        data: result,
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id, type: activities_interface_1.ActivitiesType.Created, title: `${result === null || result === void 0 ? void 0 : result.type} Create ` });
}));
const invoiceManagementGetSingle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const result = yield invoice_management_service_1.invoiceManagementService.invoiceManagementGetSingleDB(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: " InvoiceManagement retrieved successfully.",
        data: result,
    });
}));
const invoiceManagementGetAll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const allowedTypes = Object.values(invoice_management_interface_1.InvoiceManagementType);
    const type = req.query.type;
    if (!type) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invoice type is required. Allowed types: ${allowedTypes.join(", ")}`);
    }
    if (!allowedTypes.includes(type)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invalid type. Allowed types: ${allowedTypes.join(", ")}`);
    }
    const result = yield invoice_management_service_1.invoiceManagementService.invoiceManagementGetAllDB(req.query, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, type);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: " InvoiceManagement retrieved all successfully.",
        data: result.allInvoice,
        pagination: result.pagination,
    });
}));
exports.invoiceManagementController = {
    invoiceManagementCreate,
    invoiceManagementGetSingle,
    invoiceManagementGetAll,
};
