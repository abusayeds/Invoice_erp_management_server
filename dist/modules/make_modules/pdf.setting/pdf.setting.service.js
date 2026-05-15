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
exports.pdfSettingService = void 0;
const pdf_setting_model_1 = require("./pdf.setting.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const PdfSettingCreateDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield pdf_setting_model_1.PDFSettingModel.findOne({ user_id: payload.user_id, pdfType: payload.pdfType });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "alredy added");
    }
    const result = yield pdf_setting_model_1.PDFSettingModel.create(payload);
    return result;
});
const PdfSettingUpdateDB = (pdfType, payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield pdf_setting_model_1.PDFSettingModel.findOne({ pdfType, user_id: user_id });
    if (!pdfType) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "pdfType is required !");
    }
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "PDF Setting not found");
    }
    const result = yield pdf_setting_model_1.PDFSettingModel.findOneAndUpdate({ pdfType }, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.pdfSettingService = {
    PdfSettingCreateDB,
    PdfSettingUpdateDB,
};
