"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModel = void 0;
const mongoose_1 = require("mongoose");
const subscription_interface_1 = require("./subscription.interface");
const subscriptionSchema = new mongoose_1.Schema({
    price: {
        type: Number,
        required: true,
    },
    plan: {
        type: String,
        enum: Object.values(subscription_interface_1.SubscriptionPlan),
        required: true,
    },
    businesses: {
        type: Number,
        required: true,
    },
    contacts: {
        type: Number,
        required: true,
    },
    invoices: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    estimates: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    proformaInvoices: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});
exports.SubscriptionModel = (0, mongoose_1.model)("Subscription", subscriptionSchema);
