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
exports.ServiceService = void 0;
const service_model_1 = require("./service.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const queryBuilder_1 = __importDefault(require("../../../builder/queryBuilder"));
const createServiceDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield service_model_1.ServiceModel.create(payload);
});
const getAllServiceDB = (user_id, query) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceQuery = new queryBuilder_1.default(service_model_1.ServiceModel.find({ user_id, isArchive: false, isDeleted: false }), query).search(["serviceName", "unitType", "description"]).filter().sort().fields();
    const { totalData } = yield serviceQuery.paginate(service_model_1.ServiceModel.find({ user_id, isArchive: false, isDeleted: false }));
    const allService = yield serviceQuery.modelQuery.exec();
    const currentPage = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = serviceQuery.calculatePagination({ totalData, currentPage, limit });
    return { allService, pagination };
});
const getSingleServiceDB = (user_id, id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield service_model_1.ServiceModel.findOne({
        _id: id,
        user_id,
        isDeleted: false,
    });
    if (!data) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service not found");
    }
    return data;
});
const updateServiceDB = (user_id, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield service_model_1.ServiceModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, payload, { new: true });
    if (!data) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service not found");
    }
    return data;
});
const deleteServiceDB = (user_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.ServiceModel.findOneAndUpdate({ user_id, _id: payload._id }, payload, { new: true });
    return result;
});
exports.ServiceService = {
    createServiceDB,
    getAllServiceDB,
    getSingleServiceDB,
    updateServiceDB,
    deleteServiceDB,
};
