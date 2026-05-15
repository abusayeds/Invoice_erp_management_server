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
exports.deleteUser = exports.BlockUser = exports.userController = void 0;
const role_1 = require("./../../../utils/role");
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const decoded_1 = require("../../../middlewares/decoded");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const user_model_1 = require("./user.model");
const user_service_1 = require("./user.service");
const pdf_setting_service_1 = require("../../make_modules/pdf.setting/pdf.setting.service");
const pdf_setting_model_1 = require("../../make_modules/pdf.setting/pdf.setting.model");
const app_setting_model_1 = require("../../make_modules/app.setting/app.setting.model");
const seedData_1 = require("../../../utils/seedData");
const editTitles_model_1 = require("../../make_modules/editTitles/editTitles.model");
const category_model_1 = require("../../make_modules/category/category.model");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "email is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide a valid email address.");
    }
    const result = yield user_service_1.userService.createUserDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Verify OTP to register.",
        data: result,
    });
}));
const verifyOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const { decoded } = yield (0, decoded_1.tokenDecoded)(req, res);
    const email = decoded.email;
    const storedOTP = yield (0, user_service_1.getStoredOTP)(email);
    if (!storedOTP || storedOTP !== otp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid or expired OTP");
    }
    const result = yield user_service_1.userService.verifyOtpDB(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Registration successful.",
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_service_1.userService.loginDB(email, password);
    const token = (0, user_service_1.generateToken)({ user: user });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Login complete!",
        data: {
            user,
            token,
        },
    });
    if (role_1.role.company === user.role) {
        const isExistSetting = yield app_setting_model_1.SettingModel.findOne({ user_id: user === null || user === void 0 ? void 0 : user._id });
        if (!isExistSetting) {
            yield app_setting_model_1.SettingModel.create(Object.assign({ user_id: user === null || user === void 0 ? void 0 : user._id }, seedData_1.setting_seed_data));
        }
        const existingPdfSetting = yield pdf_setting_model_1.PDFSettingModel.findOne({
            user_id: user === null || user === void 0 ? void 0 : user._id,
        });
        if (!existingPdfSetting) {
            for (const type of pdf_setting_model_1.documentTypes) {
                yield pdf_setting_service_1.pdfSettingService.PdfSettingCreateDB({
                    user_id: user === null || user === void 0 ? void 0 : user._id,
                    pdfType: type,
                    style: {
                        text_color: "#000000",
                        fill_color: "#3a4a6b",
                        border_color: "#cccccc",
                        fill_text_color: "#ffffff",
                        font: "times",
                        font_size: "normal",
                        full_page: "no",
                        horizontal_lines: "show",
                        vertical_lines: "show",
                        scaling: "fit_to_page",
                        horizontal_alignment: "left",
                        vertical_alignment: "top",
                        margin: {
                            top: 15,
                            right: 15,
                            bottom: 15,
                            left: 15,
                        },
                        outer_border: "show",
                    },
                    columns: {
                        serial: true,
                        line_item_image: true,
                        variant_size: "with_product",
                        variant_type: "with_product",
                        sku: true,
                        sac: true,
                        hsn: true,
                        quntity: "show_for_both",
                        price: true,
                        discount: true,
                        tax: "individual",
                        line_item_tax_format: "show_as_percentage",
                        item_display_order: "products_first",
                        notes: "light",
                        line_total: true,
                        show_price_with_tax: "no",
                        line_description_full_with: true,
                    },
                    header: {
                        title_alignment: "center",
                        sub_title_alignment: "center",
                        sub_title: true,
                        logo_size: "medium",
                        date_format: "medium",
                        logo: true,
                        header: true,
                        status_watermark: true,
                        number: true,
                        po_no: true,
                        due_date: true,
                        total_outstanding: true,
                        paid_amount: true,
                        qr_code: true,
                        qr_code_alignment: "right",
                        document_copy_label: true,
                        total_amount: true,
                        ganarated_by: true,
                        supply_type: true,
                        ganarated_date: true,
                        cancelled_date: true,
                        valid_till: true,
                    },
                    company: {
                        Reg_no: true,
                        reg_no_tax_id_align_below: "name",
                        tax_id: true,
                        name: true,
                        country: true,
                        address: true,
                        phone: true,
                        mobile: true,
                        fax: true,
                        email: true,
                        website: true,
                    },
                    contact: {
                        tax_id: true,
                        reg_no: true,
                        reg_no_tax_id_align_below: "address",
                        home_phone: true,
                        business_phone: true,
                        email: true,
                        email_below_contact: "name",
                        mobaile: true,
                        fax: true,
                        first_last_name: true,
                        mobile_below_contact: "name",
                        address_alignment: "left",
                        billing_adreess_alignment: "left",
                        shipping_adreess_alignment: "right",
                    },
                    summary: {
                        total_quantity: {
                            single_total: true,
                            group_by_unit: true,
                        },
                        include_items_from: {
                            products: true,
                            tasks: true,
                        },
                        amount_unused: true,
                        sub_total: true,
                        discount: true,
                        inline_discount: true,
                        shipping_cost: true,
                        shipping_method: true,
                        total: true,
                        amount_due: true,
                        amount_paid: true,
                        amount_used: true,
                        tax: "combine",
                        tax_value: true,
                        taxable_amount: true,
                        tatal_in_words: true,
                        hsc_sac_summary: true,
                        return_order: true,
                    },
                    notes_terms: {
                        notes: true,
                        notes_title: true,
                        font_size: "medium",
                        bank_details: true,
                        bank_details_title: true,
                        full_with: true,
                        terms_and_condition: true,
                    },
                    signature: {
                        company_sign: "company",
                        contact_sign: true,
                        company_signature_alignment: "right",
                        contact_signature_alignment: "left",
                        signature_size: "medium",
                    },
                    footer: {
                        created_moon_invoice_hyperlink: true,
                        show_tamplate_for_pages: "all",
                        page_number_alignment: "center",
                    },
                });
            }
        }
        const existing = yield editTitles_model_1.EditTitleModel.findOne({ user_id: user === null || user === void 0 ? void 0 : user._id });
        if (!existing) {
            yield editTitles_model_1.EditTitleModel.create({
                user_id: user._id,
                titles: seedData_1.seedEditTitles,
            });
        }
        const existingCategory = yield category_model_1.CategoryModel.findOne({ user_id: user._id });
        if (!existingCategory) {
            const categoryData = seedData_1.seedCategory.map((item) => (Object.assign(Object.assign({}, item), { user_id: user._id })));
            yield category_model_1.CategoryModel.insertMany(categoryData);
        }
    }
}));
const googleLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.authProvider || req.body.authProvider !== "google") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid authentication provider.");
    }
    const user = yield user_service_1.userService.googleLoginDB(req.body);
    const token = (0, user_service_1.generateToken)({ user: user });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Login complete!",
        data: { user, token },
    });
    const isExistSetting = yield app_setting_model_1.SettingModel.findOne({ user_id: user === null || user === void 0 ? void 0 : user._id });
    if (!isExistSetting) {
        yield app_setting_model_1.SettingModel.create(Object.assign({ user_id: user === null || user === void 0 ? void 0 : user._id }, seedData_1.setting_seed_data));
    }
    for (const type of pdf_setting_model_1.documentTypes) {
        yield pdf_setting_service_1.pdfSettingService.PdfSettingCreateDB({
            user_id: user === null || user === void 0 ? void 0 : user._id,
            pdfType: type,
            style: {
                text_color: "#000000",
                fill_color: "#3a4a6b",
                border_color: "#cccccc",
                fill_text_color: "#ffffff",
                font: "times",
                font_size: "normal",
                full_page: "no",
                horizontal_lines: "show",
                vertical_lines: "show",
                scaling: "fit_to_page",
                horizontal_alignment: "left",
                vertical_alignment: "top",
                margin: {
                    top: 15,
                    right: 15,
                    bottom: 15,
                    left: 15,
                },
                outer_border: "show",
            },
            columns: {
                serial: true,
                line_item_image: true,
                variant_size: "with_product",
                variant_type: "with_product",
                sku: true,
                sac: true,
                hsn: true,
                quntity: "show_for_both",
                price: true,
                discount: true,
                tax: "individual",
                line_item_tax_format: "show_as_percentage",
                item_display_order: "products_first",
                notes: "light",
                line_total: true,
                show_price_with_tax: "no",
                line_description_full_with: true,
            },
            header: {
                title_alignment: "center",
                sub_title_alignment: "center",
                sub_title: true,
                logo_size: "medium",
                date_format: "medium",
                logo: true,
                header: true,
                status_watermark: true,
                number: true,
                po_no: true,
                due_date: true,
                total_outstanding: true,
                paid_amount: true,
                qr_code: true,
                qr_code_alignment: "right",
                document_copy_label: true,
                total_amount: true,
                ganarated_by: true,
                supply_type: true,
                ganarated_date: true,
                cancelled_date: true,
                valid_till: true,
            },
            company: {
                Reg_no: true,
                reg_no_tax_id_align_below: "name",
                tax_id: true,
                name: true,
                country: true,
                address: true,
                phone: true,
                mobile: true,
                fax: true,
                email: true,
                website: true,
            },
            contact: {
                tax_id: true,
                reg_no: true,
                reg_no_tax_id_align_below: "address",
                home_phone: true,
                business_phone: true,
                email: true,
                email_below_contact: "name",
                mobaile: true,
                fax: true,
                first_last_name: true,
                mobile_below_contact: "name",
                address_alignment: "left",
                billing_adreess_alignment: "left",
                shipping_adreess_alignment: "right",
            },
            summary: {
                total_quantity: {
                    single_total: true,
                    group_by_unit: true,
                },
                include_items_from: {
                    products: true,
                    tasks: true,
                },
                amount_unused: true,
                sub_total: true,
                discount: true,
                inline_discount: true,
                shipping_cost: true,
                shipping_method: true,
                total: true,
                amount_due: true,
                amount_paid: true,
                amount_used: true,
                tax: "combine",
                tax_value: true,
                taxable_amount: true,
                tatal_in_words: true,
                hsc_sac_summary: true,
                return_order: true,
            },
            notes_terms: {
                notes: true,
                notes_title: true,
                font_size: "medium",
                bank_details: true,
                bank_details_title: true,
                full_with: true,
                terms_and_condition: true,
            },
            signature: {
                company_sign: "company",
                contact_sign: true,
                company_signature_alignment: "right",
                contact_signature_alignment: "left",
                signature_size: "medium",
            },
            footer: {
                created_moon_invoice_hyperlink: true,
                show_tamplate_for_pages: "all",
                page_number_alignment: "center",
            },
        });
    }
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide an email.");
    }
    yield user_service_1.userService.forgotPasswordDB(email);
    const token = jsonwebtoken_1.default.sign({ email, forgot: "forgot" }, config_1.JWT_SECRET_KEY, { expiresIn: "7d" });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "OTP sent to your email. Please check!",
        data: {
            token: token,
        },
    });
}));
const verifyForgotPasswordOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    if (!otp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "otp is required");
    }
    const { decoded } = yield (0, decoded_1.tokenDecoded)(req, res);
    const email = decoded.email;
    const forgot = decoded.forgot;
    if (forgot !== "forgot") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "invalid token");
    }
    const token = jsonwebtoken_1.default.sign({ email, verifyForgot: "verifyForgot" }, config_1.JWT_SECRET_KEY, { expiresIn: "7d" });
    if (!email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide a valid email address.");
    }
    yield user_service_1.userService.verifyForgotPasswordOtpDB(otp, email);
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "OTP verified successfully.",
        data: {
            token: token,
        },
    });
}));
const resendOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { decoded } = yield (0, decoded_1.tokenDecoded)(req, res);
    const email = decoded.email;
    const token = jsonwebtoken_1.default.sign({ email, forgot: "forgot" }, config_1.JWT_SECRET_KEY, { expiresIn: "7d" });
    if (!email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide a valid email address.");
    }
    yield user_service_1.userService.resendOtpDB(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "A new OTP has been sent to your email.",
        data: { token },
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { decoded } = yield (0, decoded_1.tokenDecoded)(req, res);
    const verifyForgot = decoded.verifyForgot;
    if (verifyForgot !== "verifyForgot") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "invalid token");
    }
    const email = decoded.email;
    if (!email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide a valid email address.");
    }
    yield user_service_1.userService.resetPasswordDB(req.body, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset successfully.",
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { decoded } = yield (0, decoded_1.tokenDecoded)(req, res);
    const email = decoded.user.email;
    yield user_service_1.userService.changePasswordDB(req.body, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "You have successfully changed the password.",
        data: null,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { decoded } = yield (0, decoded_1.tokenDecoded)(req, res);
    const userId = decoded.user._id;
    const result = yield user_service_1.userService.updateUserDB(req.body, req.file, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile updated.",
        data: result,
    });
}));
const myProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_service_1.userService.myProfileDB((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "profile information retrieved successfully",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rersult = yield user_service_1.userService.allUserDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User list retrieved successfully",
        data: rersult,
    });
}));
const createUserByCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield user_service_1.userService.createUserByCompanyDB(companyId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User created successfully with role permissions.",
        data: result,
    });
}));
exports.userController = {
    registerUser,
    loginUser,
    googleLogin,
    forgotPassword,
    verifyForgotPasswordOTP,
    resendOTP,
    resetPassword,
    changePassword,
    updateUser,
    myProfile,
    getAllUsers,
    verifyOTP,
    createUserByCompany
};
exports.BlockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const { decoded } = yield (0, decoded_1.tokenDecoded)(req, res);
    const adminId = decoded.id;
    const requestingUser = yield user_model_1.UserModel.findById(adminId);
    if (!requestingUser || requestingUser.role !== role_1.role.superadmin) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Unauthorized: Only admins can change user status.");
    }
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    if (user.role === role_1.role.superadmin) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Cannot change status of an admin user.");
    }
    user.status = user.status === "active" ? "blocked" : "active";
    yield user.save();
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User status changed to ${user.status} successfully.`,
        data: null,
        pagination: undefined,
    });
}));
exports.deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield (0, user_service_1.findUserById)(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user not found .");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user  is already deleted.");
    }
    yield (0, user_service_1.userDelete)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "user deleted successfully",
        data: null,
    });
}));
