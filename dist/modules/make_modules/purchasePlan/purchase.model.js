"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseModel = void 0;
const mongoose_1 = require("mongoose");
const subscription_interface_1 = require("../subscription/subscription.interface");
const purchaseSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
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
        type: mongoose_1.Schema.Types.Mixed, // number | "unlimited"
        required: true,
    },
    estimates: {
        type: mongoose_1.Schema.Types.Mixed, // number | "unlimited"
        required: true,
    },
    proformaInvoices: {
        type: Boolean,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
});
exports.PurchaseModel = (0, mongoose_1.model)("Purchase", purchaseSchema);
