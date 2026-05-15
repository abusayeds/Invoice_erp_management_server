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
exports.TermsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const terms_model_1 = require("./terms.model");
const createTerms = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield terms_model_1.TermsOfUseModel.findOne();
    if (existing) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Terms already exists. Use update instead.");
    }
    const result = yield terms_model_1.TermsOfUseModel.create(payload);
    return result;
});
const getTerms = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_model_1.TermsOfUseModel.findOne();
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Terms not found.");
    }
    return result;
});
const updateTerms = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield terms_model_1.TermsOfUseModel.findOne();
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Terms not found.");
    }
    const result = yield terms_model_1.TermsOfUseModel.findOneAndUpdate({}, { $set: payload }, { new: true, runValidators: true });
    return result;
});
const deleteTerms = () => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield terms_model_1.TermsOfUseModel.findOne();
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Terms not found.");
    }
    yield terms_model_1.TermsOfUseModel.deleteOne();
    return null;
});
exports.TermsService = {
    createTerms,
    getTerms,
    updateTerms,
    deleteTerms,
};
