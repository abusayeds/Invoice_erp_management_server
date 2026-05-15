"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
    },
    customer_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Customer ID is required"],
        ref: "Customer",
    },
    payment_date: {
        type: Date,
        required: [true, "Payment date is required"],
        default: Date.now,
    },
    payment_type: {
        type: String,
        required: [true, "Payment type is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"],
    },
    notes: {
        type: String,
        default: "",
        trim: true,
    },
    internal_notes: {
        type: String,
        default: "",
        trim: true,
    },
    attachments: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isArchive: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
exports.PaymentModel = (0, mongoose_1.model)("Payment", paymentSchema);
