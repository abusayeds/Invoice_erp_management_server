"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFSettingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const pdf_setting_controller_1 = require("./pdf.setting.controller");
const router = express_1.default.Router();
router.patch("/:pdfType", (0, auth_1.authMiddleware)(role_1.role.company), pdf_setting_controller_1.pdfSettingController.PdfSettingUpdate);
exports.PDFSettingRoutes = router;
