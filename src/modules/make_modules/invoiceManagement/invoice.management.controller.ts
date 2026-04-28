import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { invoiceManagementService } from "./invoice.management.service";
import AppError from "../../../errors/AppError";
import { InvoiceManagementType, TInvoiceManagement } from "./invoice.management.interface";
import { Types } from "mongoose";

const invoiceManagementCreate = catchAsync(async (req: AuthRequest, res) => {
  const payload = req.body;
  const user_id = req?.user?._id;

  const isBulk = Array.isArray(payload);
  // const result = await invoiceManagementService.invoiceManagementCreateDB(req.body);
  if (isBulk) {
    payload.forEach(async (item: TInvoiceManagement) => {
      item.user_id = user_id as Types.ObjectId;
      await invoiceManagementService.invoiceManagementCreateDB(item);
    });
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: " InvoiceManagement created successfully",
    data: "",
  });
});

const invoiceManagementGetSingle = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await invoiceManagementService.invoiceManagementGetSingleDB(
    id,
    req.user?._id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: " InvoiceManagement retrieved successfully.",
    data: result,
  });
});
const invoiceManagementGetAll = catchAsync(async (req: AuthRequest, res) => {
  const allowedTypes = Object.values(InvoiceManagementType);
  const type = req.query.type as string;
  if (!type) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invoice type is required. Allowed types: ${allowedTypes.join(", ")}`,
    );
  }
  if (!allowedTypes.includes(type as InvoiceManagementType)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid type. Allowed types: ${allowedTypes.join(", ")}`,
    );
  }
  const result = await invoiceManagementService.invoiceManagementGetAllDB(
    req.query,
    req.user?._id as string,
    type,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: " InvoiceManagement retrieved all successfully.",
    data: result.allInvoice,
    pagination: result.pagination,
  });
});

export const invoiceManagementController = {
  invoiceManagementCreate,
  invoiceManagementGetSingle,
  invoiceManagementGetAll,
};
