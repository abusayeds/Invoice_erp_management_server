import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { invoiceManagementService } from "./invoice.management.service";

const invoiceManagementCreate = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result =  await invoiceManagementService.invoiceManagementCreateDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: " InvoiceManagement created successfully.",
    data: result,
  });
});

export const invoiceManagementController = {
  invoiceManagementCreate,
};