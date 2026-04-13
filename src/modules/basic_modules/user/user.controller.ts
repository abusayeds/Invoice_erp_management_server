/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../../config";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { UserModel } from "./user.model";
import {
  findUserById,
  generateToken,
  getStoredOTP,
  userDelete,
  userService,
} from "./user.service";
import { AuthRequest } from "../../../middlewares/auth";
import { pdfSettingService } from "../../make_modules/pdf.setting/pdf.setting.service";
import { documentTypes } from "../../make_modules/pdf.setting/pdf.setting.model";
import { SettingModel } from "../../make_modules/app.setting/app.setting.model";
import { setting_seed_data } from "../../../utils/seedData";
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, "email is required.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide a valid email address.",
    );
  }
  const result = await userService.createUserDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verify OTP to register.",
    data: result,
  });
});
const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { otp } = req.body;
  const { decoded }: any = await tokenDecoded(req, res);
  const email = decoded.email;
  const storedOTP = await getStoredOTP(email);
  if (!storedOTP || storedOTP !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  }
  const result = await userService.verifyOtpDB(email);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registration successful.",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userService.loginDB(email, password);
  const token = generateToken({ user: user });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login complete!",
    data: {
      user,
      token,
    },
  });
  const isExistSetting = await SettingModel.findOne({ user_id: user?._id });
  if (!isExistSetting) {
    await SettingModel.create({
      user_id: user?._id,
      ...setting_seed_data,
    });
  }
  for (const type of documentTypes) {
    await pdfSettingService.PdfSettingCreateDB({
      user_id: user?._id,
      pdfType: type as unknown as any,
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
});
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please provide an email.");
  }
  await userService.forgotPasswordDB(email);
  const token = jwt.sign(
    { email, forgot: "forgot" },
    JWT_SECRET_KEY as string,
    { expiresIn: "7d" },
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your email. Please check!",
    data: {
      token: token,
    },
  });
});

const verifyForgotPasswordOTP = catchAsync(
  async (req: Request, res: Response) => {
    const { otp } = req.body;
    if (!otp) {
      throw new AppError(httpStatus.BAD_REQUEST, "otp is required");
    }
    const { decoded }: any = await tokenDecoded(req, res);
    const email = decoded.email;
    const forgot = decoded.forgot;
    if (forgot !== "forgot") {
      throw new AppError(httpStatus.BAD_REQUEST, "invalid token");
    }
    const token = jwt.sign(
      { email, verifyForgot: "verifyForgot" },
      JWT_SECRET_KEY as string,
      { expiresIn: "7d" },
    );
    if (!email) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please provide a valid email address.",
      );
    }
    await userService.verifyForgotPasswordOtpDB(otp, email);
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP verified successfully.",
      data: {
        token: token,
      },
    });
  },
);
const resendOTP = catchAsync(async (req: Request, res: Response) => {
  const { decoded }: any = await tokenDecoded(req, res);
  const email = decoded.email;
  const token = jwt.sign(
    { email, forgot: "forgot" },
    JWT_SECRET_KEY as string,
    { expiresIn: "7d" },
  );
  if (!email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide a valid email address.",
    );
  }
  await userService.resendOtpDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "A new OTP has been sent to your email.",
    data: { token },
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { decoded }: any = await tokenDecoded(req, res);
  const verifyForgot = decoded.verifyForgot;
  if (verifyForgot !== "verifyForgot") {
    throw new AppError(httpStatus.BAD_REQUEST, "invalid token");
  }
  const email = decoded.email;
  if (!email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide a valid email address.",
    );
  }
  await userService.resetPasswordDB(req.body, email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully.",
    data: null,
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { decoded }: any = await tokenDecoded(req, res);
  const email = decoded.user.email;
  await userService.changePasswordDB(req.body, email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "You have successfully changed the password.",
    data: null,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { decoded }: any = await tokenDecoded(req, res);
  const userId = decoded.user._id;
  const result = await userService.updateUserDB(req.body, req.file, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated.",
    data: result,
  });
});

const myProfile = catchAsync(async (req: AuthRequest, res) => {
  const result = await userService.myProfileDB(req.user?._id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "profile information retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const rersult = await userService.allUserDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User list retrieved successfully",
    data: rersult,
  });
});

export const userController = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyForgotPasswordOTP,
  resendOTP,
  resetPassword,
  changePassword,
  updateUser,
  myProfile,
  getAllUsers,
  verifyOTP,
};

export const BlockUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { decoded }: any = await tokenDecoded(req, res);
  const adminId = decoded.id;
  const requestingUser = await UserModel.findById(adminId);
  if (!requestingUser || requestingUser.role !== "admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Unauthorized: Only admins can change user status.",
    );
  }
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user.role === "admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Cannot change status of an admin user.",
    );
  }
  user.status = user.status === "active" ? "blocked" : "active";
  await user.save();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User status changed to ${user.status} successfully.`,
    data: null,
    pagination: undefined,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.query?.id as string;

  const user = await findUserById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found .");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "user  is already deleted.");
  }
  await userDelete(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user deleted successfully",
    data: null,
  });
});
