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
exports.purchaseController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const subscription_model_1 = require("../subscription/subscription.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const payment_service_1 = require("../payment/payment.service");
const subscription_interface_1 = require("../subscription/subscription.interface");
const mongoose_1 = require("mongoose");
const activities_interface_1 = require("../activities/activities.interface");
const activities_service_1 = require("../activities/activities.service");
const purchaseSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { subscriptionId } = req.body;
    const findSubscription = yield subscription_model_1.SubscriptionModel.findById(subscriptionId);
    if (!findSubscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subscription not found");
    }
    const now = new Date();
    let endDate = new Date(now);
    switch (findSubscription.plan) {
        case subscription_interface_1.SubscriptionPlan.FREE:
            endDate.setDate(endDate.getDate() + 7);
            break;
        case subscription_interface_1.SubscriptionPlan.MONTHLY:
            endDate.setMonth(endDate.getMonth() + 1);
            break;
        case subscription_interface_1.SubscriptionPlan.YEARLY:
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
        default:
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid plan type");
    }
    const finalData = {
        user_id: new mongoose_1.Types.ObjectId(req.user._id),
        price: findSubscription.price,
        plan: findSubscription.plan,
        businesses: findSubscription.businesses,
        invoices: findSubscription.invoices,
        contacts: findSubscription.contacts,
        estimates: findSubscription.estimates,
        proformaInvoices: findSubscription.proformaInvoices,
        endDate: endDate,
        cancelUrl: req.body.cancelUrl,
        successUrl: req.body.successUrl
    };
    const user = req === null || req === void 0 ? void 0 : req.user;
    const result = yield payment_service_1.paymentService.payment(finalData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Payment session created successfully",
        data: result,
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, type: activities_interface_1.ActivitiesType.Created, title: ` ${finalData.plan} Puschase Plan ` });
}));
exports.purchaseController = {
    purchaseSubscription,
};
