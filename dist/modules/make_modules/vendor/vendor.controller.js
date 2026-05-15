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
exports.vendorController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const vendor_service_1 = require("./vendor.service");
const activities_interface_1 = require("../activities/activities.interface");
const activities_service_1 = require("../activities/activities.service");
const vendorCreate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    req.body.user_id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield vendor_service_1.vendorService.vendorCreateDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "vendor successfully.",
        data: result,
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({
        user_id: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id,
        type: activities_interface_1.ActivitiesType.Created,
        title: ` ${result === null || result === void 0 ? void 0 : result.companyName} Vendor Created`,
    });
}));
const allVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield vendor_service_1.vendorService.allVendorDB((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All vendor get successfully.",
        pagination: result.pagination,
        data: result.allVendor
    });
}));
const singleVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const result = yield vendor_service_1.vendorService.singleVendorDB((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Single vendor get successfully.",
        data: result
    });
}));
const deleteVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield vendor_service_1.vendorService.deleteVendorDB((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Oparation successfull.",
        data: result
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({
        user_id: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id,
        type: activities_interface_1.ActivitiesType.Archived,
        title: ` ${result === null || result === void 0 ? void 0 : result.companyName} Vendor Archived`,
    });
}));
const updateVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield vendor_service_1.vendorService.updateVendorDB((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Oparation successfull.",
        data: result
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({
        user_id: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id,
        type: activities_interface_1.ActivitiesType.Updated,
        title: ` ${result === null || result === void 0 ? void 0 : result.companyName} Vendor Updated`,
    });
}));
exports.vendorController = {
    vendorCreate,
    allVendor,
    singleVendor,
    deleteVendor,
    updateVendor
};
