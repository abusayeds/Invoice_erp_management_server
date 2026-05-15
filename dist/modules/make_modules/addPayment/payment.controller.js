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
exports.addPaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const activities_service_1 = require("../activities/activities.service");
const invoice_management_model_1 = require("../invoiceManagement/invoice.management.model");
const payment_service_1 = require("./payment.service");
const activities_interface_1 = require("../activities/activities.interface");
const paymentCreate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.body.user_id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield payment_service_1.addPaymentService.paymentCreateDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment created successfully",
        data: result,
    });
    if (req.body.type === "invoice") {
        yield invoice_management_model_1.InvoiceManagementModel.findByIdAndUpdate(req.body.invoice_id, { status: "Paid" }, { new: true });
        yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id, title: `${req.body.type} Paid`, type: activities_interface_1.ActivitiesType.Updated });
    }
    yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c._id, title: "Payment Created", type: activities_interface_1.ActivitiesType.Created });
}));
const paymentGetAll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield payment_service_1.addPaymentService.paymentGetAllDB(req.query, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payments retrieved successfully",
        pagination: result.pagination,
        data: result.allPayment,
    });
}));
const paymentSingle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.addPaymentService.paymentSingleDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment retrieved successfully",
        data: result,
    });
}));
const paymentUpdate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield payment_service_1.addPaymentService.paymentUpdateDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment updated successfully",
        data: result,
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, title: `Payment Updated`, type: activities_interface_1.ActivitiesType.Updated });
}));
const paymentDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield payment_service_1.addPaymentService.paymentDeleteDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment deleted successfully",
        data: null,
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, title: `Payment Deleted`, type: activities_interface_1.ActivitiesType.Archived });
}));
exports.addPaymentController = {
    paymentCreate,
    paymentGetAll,
    paymentSingle,
    paymentUpdate,
    paymentDelete
};
