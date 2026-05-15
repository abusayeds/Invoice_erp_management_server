"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const product_controller_1 = require("./product.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.company), product_controller_1.productController.productCreate);
router.get("/all", (0, auth_1.authMiddleware)(role_1.role.company), product_controller_1.productController.allProduct);
router.get("/single/:id", (0, auth_1.authMiddleware)(role_1.role.company), product_controller_1.productController.singleProduct);
router.post("/delete", (0, auth_1.authMiddleware)(role_1.role.company), product_controller_1.productController.deleteProduct);
exports.productRoutes = router;
