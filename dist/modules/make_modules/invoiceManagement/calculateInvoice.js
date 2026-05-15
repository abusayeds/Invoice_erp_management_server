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
exports.calculateInvoice = void 0;
const calculateInvoice = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let sub_total = 0;
    let inline_discount = 0;
    let tax_total = 0;
    const processItems = (items) => {
        if (!Array.isArray(items) || items.length === 0)
            return;
        for (const item of items) {
            const quantity = Number(item === null || item === void 0 ? void 0 : item.quantity) || 0;
            const rate = Number(item === null || item === void 0 ? void 0 : item.rate) || 0;
            const discountPercent = Number(item === null || item === void 0 ? void 0 : item.discount) || 0;
            const taxPercent = Number(item === null || item === void 0 ? void 0 : item.tax) || 0;
            const base = quantity * rate;
            const discountAmount = (base * discountPercent) / 100;
            const afterDiscount = base - discountAmount;
            const taxAmount = (afterDiscount * taxPercent) / 100;
            inline_discount += discountAmount;
            tax_total += taxAmount;
            sub_total += afterDiscount;
        }
    };
    processItems(data === null || data === void 0 ? void 0 : data.product);
    processItems(data === null || data === void 0 ? void 0 : data.service);
    const discountPercent = Number(data === null || data === void 0 ? void 0 : data.discount) || 0;
    const shipping_cost = Number(data === null || data === void 0 ? void 0 : data.shipping_cost) || 0;
    const deposit = Number(data === null || data === void 0 ? void 0 : data.deposit) || 0;
    const total = sub_total + tax_total;
    return {
        sub_total: Number(sub_total.toFixed(2)),
        deposit,
        discount: discountPercent,
        shipping_cost,
        inline_discount: Number(inline_discount.toFixed(2)),
        tax: Number(tax_total.toFixed(2)),
        total: Number(total.toFixed(2)),
    };
});
exports.calculateInvoice = calculateInvoice;
