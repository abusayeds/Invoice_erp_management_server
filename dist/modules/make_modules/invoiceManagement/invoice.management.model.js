"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceManagementModel = void 0;
const mongoose_1 = require("mongoose");
const invoice_management_interface_1 = require("./invoice.management.interface");
const addressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    street2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    zip: { type: String },
    country: { type: String, required: true },
}, { _id: false });
const productSchema = new mongoose_1.Schema({
    product_id: { type: mongoose_1.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    amount: { type: Number, required: true },
}, { _id: false });
const serviceSchema = new mongoose_1.Schema({
    service_id: { type: mongoose_1.Types.ObjectId, ref: "Service", },
    quantity: { type: Number, },
    rate: { type: Number, },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    amount: { type: Number, },
}, { _id: false });
const invoiceManagementSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(invoice_management_interface_1.InvoiceManagementType),
        required: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    customer_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Customer",
    },
    vendor_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Vendor",
    },
    invoice_number: { type: String },
    currency: { type: String, },
    date: { type: Date, },
    due_date: { type: Date, },
    sub_title: { type: String },
    po: { type: mongoose_1.Schema.Types.Mixed },
    shipping_method: { type: String },
    payment_method: [{ type: String }],
    discount_before_tax: { type: Number, default: 0 },
    billing_address: { type: addressSchema, },
    shipping_address: { type: addressSchema, },
    product: [productSchema],
    service: [serviceSchema],
    terms_and_conditions: { type: String },
    notes: { type: String },
    internal_notes: { type: String },
    Attachment: { type: String },
    status: { type: String, enum: invoice_management_interface_1.invoiceStatus, default: "Draft" },
    sub_total: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shipping_cost: { type: Number, default: 0 },
    inline_discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    archive: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.InvoiceManagementModel = (0, mongoose_1.model)("InvoiceManagement", invoiceManagementSchema);
