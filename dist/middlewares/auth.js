"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const role_1 = require("../utils/role");
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../modules/basic_modules/user/user.model");
const authMiddleware = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format."));
            }
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            const user = yield user_model_1.UserModel.findById(decoded.user._id);
            if (!user) {
                return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User not found or unauthorized."));
            }
            const userRole = decoded.user.role;
            if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
                return next(new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized."));
            }
            req.user = user;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token!"));
            }
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Token expired!"));
            }
            next(error);
        }
    });
};
exports.authMiddleware = authMiddleware;
const checkPermission = (permission) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User not found"));
        }
        if (user.role === role_1.role.superadmin) {
            return next();
        }
        if (user.permissions && user.permissions.includes(permission)) {
            return next();
        }
        return next(new AppError_1.default(http_status_1.default.FORBIDDEN, "Permission denied"));
    });
};
exports.checkPermission = checkPermission;
