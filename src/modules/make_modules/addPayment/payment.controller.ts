import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { InvoiceManagementModel } from "../invoiceManagement/invoice.management.model";
import { addPaymentService } from "./payment.service";

const paymentCreate = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result = await addPaymentService.paymentCreateDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
  if (req.body.type === "invoice") {
    await InvoiceManagementModel.findByIdAndUpdate(
      req.body.invoice_id,
      { status: "Paid" },
      { new: true },
    );
  }
});

const paymentGetAll = catchAsync(async (req: AuthRequest, res) => {
    const result = await addPaymentService.paymentGetAllDB(req.query, req?.user?._id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payments retrieved successfully",
        pagination: result.pagination,
        data: result.allPayment,
    });
});

const paymentSingle = catchAsync(async (req: AuthRequest, res) => {
  const result = await addPaymentService.paymentSingleDB(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
}
);  
const paymentUpdate = catchAsync(async (req: AuthRequest, res) => {
    const result = await addPaymentService.paymentUpdateDB(req.params.id, req.body);        
    sendResponse(res, {
        statusCode: 200,
        success: true,     
         message: "Payment updated successfully",
        data: result,
    });
}); 
const paymentDelete = catchAsync(async (req: AuthRequest, res) => {
    await addPaymentService.paymentDeleteDB(req.params.id);        
    sendResponse(res, {
        statusCode: 200,
        success: true,     
         message: "Payment deleted successfully",
         data: null,
    }); 
});          


export const addPaymentController = {
  paymentCreate,
  paymentGetAll,
  paymentSingle,
    paymentUpdate,
    paymentDelete
};
