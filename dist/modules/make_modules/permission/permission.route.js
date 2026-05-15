"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const permission_controller_1 = require("./permission.controller");
const router = express_1.default.Router();
router.patch("/update-permission", (0, auth_1.authMiddleware)(role_1.role.company), permission_controller_1.permissionController.updatePermission);
router.get("/my-permissions", (0, auth_1.authMiddleware)(role_1.role.company), permission_controller_1.permissionController.getPermissionsByCompany);
exports.permissionRoutes = router;
