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
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionService = void 0;
const subscription_model_1 = require("./subscription.model");
const createSubscriptionDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscription_model_1.SubscriptionModel.create(payload);
    return subscription;
});
const getAllSubscriptionsDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptions = yield subscription_model_1.SubscriptionModel.find();
    return subscriptions;
});
const getSingleSubscriptionDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscription_model_1.SubscriptionModel.findById(id);
    return subscription;
});
const updateSubscriptionDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscription_model_1.SubscriptionModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return subscription;
});
const deleteSubscriptionDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscription_model_1.SubscriptionModel.findByIdAndDelete(id);
    return subscription;
});
exports.subscriptionService = {
    createSubscriptionDB,
    getAllSubscriptionsDB,
    getSingleSubscriptionDB,
    updateSubscriptionDB,
    deleteSubscriptionDB,
};
