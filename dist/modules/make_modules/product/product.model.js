"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const pricingSchema = new mongoose_1.Schema({
    buyPrice: { type: Number, default: 0 },
    buyPriceTax: { type: Number, default: 0 },
    sellPrice: { type: Number, default: 0 },
    sellPriceTax: { type: Number, default: 0 },
    currency: { type: String, default: "USD", required: true },
}, { _id: false });
const stockSchema = new mongoose_1.Schema({
    onHandStock: { type: Number, default: 0 },
    committedStock: { type: Number, default: 0 },
    availableForSale: { type: Number, default: 0 },
    toBeInvoiced: { type: Number, default: 0 },
    toBeBilled: { type: Number, default: 0 },
}, { _id: false });
const productSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    unitType: { type: String },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String },
    pricing: { type: pricingSchema, required: true },
    stock: { type: stockSchema, required: true },
    description: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    isArchive: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.ProductModel = (0, mongoose_1.model)("Product", productSchema);
