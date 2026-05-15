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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingService = void 0;
const app_setting_model_1 = require("./app.setting.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// ── Valid subTypes per type ──────────────────────────────
const SUB_TYPE_MAP = {
    invoice: ["general", "columns", "summary", "print_email"],
    sales_receipt: ["general", "columns", "summary", "print_email"],
    estimate: ["general", "columns", "summary", "print_email"],
    delivery_challan: ["general", "columns", "summary", "print_email"],
    purchase_order: ["general", "columns", "summary", "print_email"],
    proforma_invoice: ["general", "columns", "summary", "print_email"],
    bill: ["general", "columns", "summary", "print_email"],
    debit_note: ["general", "columns", "summary", "print_email"],
    credit_note: ["general", "columns", "summary", "print_email"],
    product: ["general", "stock"],
    // subType  — flat
    general: [],
    modules: [],
    currency_format: [],
    whatsApp: [],
    expense: [],
};
// ── Validation helper ────────────────────────────────────
const validateTypeAndSubType = (type, subType) => {
    const validSubTypes = SUB_TYPE_MAP[type];
    if (validSubTypes === undefined) {
        throw new Error(`Invalid type: '${type}'`);
    }
    if (subType) {
        if (validSubTypes.length === 0) {
            throw new Error(`Type '${type}' does not support subType`);
        }
        if (!validSubTypes.includes(subType)) {
            throw new Error(`Invalid subType '${subType}' for type '${type}'. Valid: ${validSubTypes.join(", ")}`);
        }
    }
};
// ── GET ──────────────────────────────────────────────────
const getSettingService = (user_id, type, subType) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!type) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Type is required ! ");
    }
    validateTypeAndSubType(type, subType);
    if (subType) {
        const data = yield app_setting_model_1.SettingModel.findOne({ user_id })
            .select(`${type}.${subType}`)
            .lean();
        if (!data)
            return null;
        return { [subType]: (_a = data[type]) === null || _a === void 0 ? void 0 : _a[subType] };
    }
    const data = yield app_setting_model_1.SettingModel.findOne({ user_id })
        .select(type)
        .lean();
    if (!data)
        return null;
    return data[type];
});
// ── UPDATE ───────────────────────────────────────────────
const updateSettingService = (user_id, type, payload, subType) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    validateTypeAndSubType(type, subType);
    const dotNotationUpdate = {};
    if (subType) {
        // ?type=invoice&subType=general
        // payload: { due_date: true, shipping_address: false }
        // → "invoice.general.due_date": true
        for (const [key, value] of Object.entries(payload)) {
            dotNotationUpdate[`${type}.${subType}.${key}`] = value;
        }
    }
    else {
        // ?type=invoice (subType)
        // payload: { "general.due_date": true }flat module payload
        for (const [key, value] of Object.entries(payload)) {
            dotNotationUpdate[`${type}.${key}`] = value;
        }
    }
    const updated = yield app_setting_model_1.SettingModel.findOneAndUpdate({ user_id }, { $set: dotNotationUpdate }, { new: true, upsert: true, runValidators: true }).lean();
    if (!updated)
        return null;
    if (subType) {
        return {
            [type]: {
                [subType]: (_a = updated[type]) === null || _a === void 0 ? void 0 : _a[subType],
            },
        };
    }
    return { [type]: updated[type] };
});
exports.settingService = {
    getSettingService, updateSettingService
};
