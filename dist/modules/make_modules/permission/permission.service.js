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
exports.permissionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const permission_model_1 = require("./permission.model");
const updatePermissionDB = (companyId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, permissions } = payload;
    if (!role) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Role is required");
    }
    const result = yield permission_model_1.PermissionModel.findOneAndUpdate({ companyId, role }, { permissions }, { new: true, upsert: true });
    return result;
});
const getPermissionsByCompanyDB = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield permission_model_1.PermissionModel.find({ companyId });
    return result;
});
const getPermissionByRoleDB = (companyId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield permission_model_1.PermissionModel.findOne({ companyId, role });
    return result;
});
exports.permissionService = {
    updatePermissionDB,
    getPermissionsByCompanyDB,
    getPermissionByRoleDB,
};
