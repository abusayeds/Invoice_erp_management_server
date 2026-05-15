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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const user_model_1 = require("../modules/basic_modules/user/user.model");
const permission_model_1 = require("../modules/make_modules/permission/permission.model");
const role_1 = require("../utils/role");
const permissions_1 = require("../utils/permissions");
const superAdminData = {
    name: "Super Admin",
    email: "superadmin@example.com",
    password: "1234", // Note: The pre-save hook on the User model will hash this
    role: role_1.role.superadmin,
    permissions: permissions_1.ROLE_PERMISSIONS.superadmin,
    isDeleted: false,
};
const companyData = {
    name: "Company",
    email: "company@example.com",
    password: "1234", // Note: The pre-save hook on the User model will hash this
    phone: "1234567890",
    language: "en",
    role: role_1.role.company,
    permissions: permissions_1.ROLE_PERMISSIONS.company,
    isDeleted: false,
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create or Update Super Admin User
    let superAdmin = yield user_model_1.UserModel.findOne({ email: superAdminData.email });
    if (!superAdmin) {
        superAdmin = yield user_model_1.UserModel.create(superAdminData);
    }
    else {
        superAdmin.permissions = superAdminData.permissions;
        yield superAdmin.save();
    }
    // Create or Update Company User
    let company = yield user_model_1.UserModel.findOne({ email: companyData.email });
    if (!company) {
        company = yield user_model_1.UserModel.create(Object.assign(Object.assign({}, companyData), { companyId: superAdmin._id }));
    }
    else {
        company.permissions = companyData.permissions;
        yield company.save();
    }
    // Assign Default Roles permissions to PermissionModel for future company staff
    // Using the newly created company._id for mapping company role
    yield permission_model_1.PermissionModel.findOneAndUpdate({ companyId: null, role: role_1.role.superadmin }, { permissions: permissions_1.ROLE_PERMISSIONS.superadmin }, { new: true, upsert: true });
    yield permission_model_1.PermissionModel.findOneAndUpdate({ companyId: null, role: role_1.role.company }, { permissions: permissions_1.ROLE_PERMISSIONS.company }, { new: true, upsert: true });
});
exports.seedSuperAdmin = seedSuperAdmin;
exports.default = exports.seedSuperAdmin;
