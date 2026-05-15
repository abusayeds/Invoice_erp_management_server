"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const terms_controller_1 = require("./terms.controller");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const router = express_1.default.Router();
router.post("/", (0, auth_1.authMiddleware)(role_1.role.superadmin), terms_controller_1.TermsController.createTerms);
router.get("/", (0, auth_1.authMiddleware)(role_1.role.company), terms_controller_1.TermsController.getTerms);
router.patch("/", (0, auth_1.authMiddleware)(role_1.role.superadmin), terms_controller_1.TermsController.updateTerms);
router.delete("/", (0, auth_1.authMiddleware)(role_1.role.superadmin), terms_controller_1.TermsController.deleteTerms);
exports.TermsRoutes = router;
