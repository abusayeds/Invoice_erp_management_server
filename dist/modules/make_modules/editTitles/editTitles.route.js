"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditTitlesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const editTitles_controller_1 = require("./editTitles.controller");
const router = express_1.default.Router();
router.patch("/update", (0, auth_1.authMiddleware)(role_1.role.company), editTitles_controller_1.editTitleController.editTitlesUpdate);
router.get("/single/:id", (0, auth_1.authMiddleware)(role_1.role.company), editTitles_controller_1.editTitleController.singleEditTitles);
router.get("/my", (0, auth_1.authMiddleware)(role_1.role.company), editTitles_controller_1.editTitleController.myEditTitles);
exports.EditTitlesRoutes = router;
