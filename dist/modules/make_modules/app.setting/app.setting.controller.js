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
exports.appSettingController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const app_setting_service_1 = require("./app.setting.service");
const activities_service_1 = require("../activities/activities.service");
const activities_interface_1 = require("../activities/activities.interface");
//  GET Setting
const getSetting = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const type = req.query.type;
    const subType = req.query.subType;
    const data = yield app_setting_service_1.settingService.getSettingService(user === null || user === void 0 ? void 0 : user._id, type, subType);
    if (!data) {
        throw new AppError_1.default(404, "Setting not found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Setting fetched successfully",
        data,
    });
}));
//  UPDATE Setting
const updateSetting = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req === null || req === void 0 ? void 0 : req.user;
    const type = req.body.type;
    const subType = req.body.subType;
    if (!type) {
        throw new AppError_1.default(400, "'type' body is required");
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new AppError_1.default(400, "Request body cannot be empty");
    }
    const data = yield app_setting_service_1.settingService.updateSettingService(user === null || user === void 0 ? void 0 : user._id, type, req.body, subType);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Setting updated successfully",
        data,
    });
    yield activities_service_1.activitiesService.activitiesCreateDB({ user_id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, title: `Setting Updated`, type: activities_interface_1.ActivitiesType.Updated });
}));
exports.appSettingController = {
    getSetting,
    updateSetting,
};
