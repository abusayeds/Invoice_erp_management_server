"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceManagementRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const invoice_management_controller_1 = require("./invoice.management.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.company), invoice_management_controller_1.invoiceManagementController.invoiceManagementCreate);
router.get("/single/:id", (0, auth_1.authMiddleware)(role_1.role.company), invoice_management_controller_1.invoiceManagementController.invoiceManagementGetSingle);
router.get("/all", (0, auth_1.authMiddleware)(role_1.role.company), invoice_management_controller_1.invoiceManagementController.invoiceManagementGetAll);
exports.invoiceManagementRoutes = router;
