"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateItemAmount = void 0;
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const validateItemAmount = (item, type) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discountPercent = Number(item.discount) || 0;
    const base = quantity * rate;
    const discountAmount = (base * discountPercent) / 100;
    const expectedAmount = base - discountAmount;
    const frontendAmount = Number(item.amount) || 0;
    const expected = Number(expectedAmount.toFixed(2));
    const received = Number(frontendAmount.toFixed(2));
    if (expected !== received) {
        throw new AppError_1.default(400, `${type} amount mismatch. Expected: ${expected}, Received: ${received}`);
    }
    return true;
};
exports.validateItemAmount = validateItemAmount;
