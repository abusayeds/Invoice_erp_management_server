"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const vendor_controller_1 = require("./vendor.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.company), vendor_controller_1.vendorController.vendorCreate);
router.get("/all", (0, auth_1.authMiddleware)(role_1.role.company), vendor_controller_1.vendorController.allVendor);
router.get("/single/:id", (0, auth_1.authMiddleware)(role_1.role.company), vendor_controller_1.vendorController.singleVendor);
router.post("/delete", (0, auth_1.authMiddleware)(role_1.role.company), vendor_controller_1.vendorController.deleteVendor);
router.post("/update", (0, auth_1.authMiddleware)(role_1.role.company), vendor_controller_1.vendorController.updateVendor);
exports.vendorRoutes = router;
