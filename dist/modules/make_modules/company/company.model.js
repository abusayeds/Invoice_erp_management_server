"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    street1: { type: String, default: "" },
    street2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "" },
}, { _id: false });
const companySchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    companyLogo: { type: String, default: "" },
    businessName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    mobile: { type: String, default: "" },
    fax: { type: String, default: "" },
    website: { type: String, default: "" },
    billingAddress: { type: addressSchema, default: () => ({}) },
    shippingAddress: { type: addressSchema, default: () => ({}) },
    reg_No: { type: String, default: "" },
    tax_id: { type: String, default: "" },
    payment_terms_seles: { type: String, default: "" },
    payment_terms_purchase: { type: String, default: "" },
    financialYear: { type: String, default: "" },
}, {
    timestamps: true,
});
exports.Company = (0, mongoose_1.model)("Company", companySchema);
