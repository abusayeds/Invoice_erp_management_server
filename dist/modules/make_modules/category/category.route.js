"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.company), category_controller_1.categoryController.createCategory);
router.get("/all", (0, auth_1.authMiddleware)(role_1.role.company), category_controller_1.categoryController.getAllCategory);
router.get("/:id", (0, auth_1.authMiddleware)(role_1.role.company), category_controller_1.categoryController.getSingleCategory);
router.patch("/:id", (0, auth_1.authMiddleware)(role_1.role.company), category_controller_1.categoryController.updateCategory);
router.delete("/:id", (0, auth_1.authMiddleware)(role_1.role.company), category_controller_1.categoryController.deleteCategory);
exports.categoryRoutes = router;
