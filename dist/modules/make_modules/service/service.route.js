"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const service_controller_1 = require("./service.controller");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.company), service_controller_1.ServiceController.createService);
router.get("/all", (0, auth_1.authMiddleware)(role_1.role.company), service_controller_1.ServiceController.getAllService);
router.get("/:id", (0, auth_1.authMiddleware)(role_1.role.company), service_controller_1.ServiceController.getSingleService);
router.patch("/:id", (0, auth_1.authMiddleware)(role_1.role.company), service_controller_1.ServiceController.updateService);
router.delete("/:id", (0, auth_1.authMiddleware)(role_1.role.company), service_controller_1.ServiceController.deleteService);
exports.serviceRoutes = router;
