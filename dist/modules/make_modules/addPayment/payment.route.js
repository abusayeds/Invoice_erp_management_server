"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.company), payment_controller_1.addPaymentController.paymentCreate);
router.get("/all", (0, auth_1.authMiddleware)(role_1.role.company), payment_controller_1.addPaymentController.paymentGetAll);
router.get("/:id", (0, auth_1.authMiddleware)(role_1.role.company), payment_controller_1.addPaymentController.paymentSingle);
router.patch("/:id", (0, auth_1.authMiddleware)(role_1.role.company), payment_controller_1.addPaymentController.paymentUpdate);
router.delete("/:id", (0, auth_1.authMiddleware)(role_1.role.company), payment_controller_1.addPaymentController.paymentDelete);
exports.paymentRoutes = router;
