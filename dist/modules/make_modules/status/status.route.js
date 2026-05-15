"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const status_controller_1 = require("./status.controller");
const router = express_1.default.Router();
router.get("/graphChart", (0, auth_1.authMiddleware)(role_1.role.company), status_controller_1.statusController.graphChart);
router.get("/top-customers", (0, auth_1.authMiddleware)(role_1.role.company), status_controller_1.statusController.topCustomer);
router.get("/top-products", (0, auth_1.authMiddleware)(role_1.role.company), status_controller_1.statusController.topProducts);
router.get("/:date", (0, auth_1.authMiddleware)(role_1.role.company), status_controller_1.statusController.getStatusData);
exports.statusRoutes = router;
