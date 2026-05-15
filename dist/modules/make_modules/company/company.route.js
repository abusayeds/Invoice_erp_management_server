"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("./company.controller");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.company), company_controller_1.companyController.createCompany);
router.get("/", company_controller_1.companyController.getAllCompanies);
router.get("/:id", company_controller_1.companyController.getSingleCompany);
router.patch("/update/:id", company_controller_1.companyController.updateCompany);
router.delete("/delete/:id", company_controller_1.companyController.deleteCompany);
exports.companyRoutes = router;
