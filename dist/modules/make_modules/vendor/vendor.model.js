"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorModel = void 0;
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
}, { _id: false });
const ventorSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Types.ObjectId, ref: "User" },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    reg_no: { type: String },
    tax_id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    BusinessPhone: { type: String },
    fax: { type: String },
    mobile: { type: String },
    home_phone: { type: String },
    address: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema, required: true },
    bank_details: { type: String },
    currency: { type: String },
    tax_service: { type: String },
    tax_product: { type: String },
    hourly_rate: { type: String },
    payment_terms_seles: { type: String },
    opening_balance: { type: Number, default: 0 },
    opening_balance_date: { type: Date },
    notes: { type: String },
    payment_reminder: { type: Boolean, default: false },
    custormer: { type: Boolean, default: false },
    vendor: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    archive: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.VendorModel = (0, mongoose_1.model)("Vendor", ventorSchema);
