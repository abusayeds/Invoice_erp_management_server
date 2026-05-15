"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const customer_controller_1 = require("./customer.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.company), customer_controller_1.customerController.customerCreate);
router.get("/all", (0, auth_1.authMiddleware)(role_1.role.company), customer_controller_1.customerController.allCustomer);
router.get("/single/:id", (0, auth_1.authMiddleware)(role_1.role.company), customer_controller_1.customerController.singleCustomer);
router.post("/delete", (0, auth_1.authMiddleware)(role_1.role.company), customer_controller_1.customerController.deleteCustomer);
router.post("/update", (0, auth_1.authMiddleware)(role_1.role.company), customer_controller_1.customerController.updateCustomer);
exports.customerRoutes = router;
