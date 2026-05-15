"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("./subscription.controller");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.superadmin), subscription_controller_1.subscriptionController.createSubscription);
router.get("/", (0, auth_1.authMiddleware)(role_1.role.superadmin, role_1.role.company), subscription_controller_1.subscriptionController.getAllSubscriptions);
router.get("/:id", (0, auth_1.authMiddleware)(role_1.role.superadmin, role_1.role.company), subscription_controller_1.subscriptionController.getSingleSubscription);
router.patch("/:id", (0, auth_1.authMiddleware)(role_1.role.superadmin), subscription_controller_1.subscriptionController.updateSubscription);
router.delete("/:id", (0, auth_1.authMiddleware)(role_1.role.superadmin), subscription_controller_1.subscriptionController.deleteSubscription);
exports.subscriptionRoutes = router;
