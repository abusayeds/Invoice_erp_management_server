
import { Types } from "mongoose";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { activitiesService } from "../activities/activities.service";
import { InvoiceModel } from "../invoice/invoice.model";
import { addPaymentService } from "./payment.service";
import { ActivitiesType } from "../activities/activities.interface";

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
    await InvoiceModel.findByIdAndUpdate(
      req.body.invoice_id,
      { status: "Paid" },
      { new: true },
      
    );
    await activitiesService.activitiesCreateDB({ user_id: req?.user?._id as Types.ObjectId,title: `${req.body.type} Paid` , type : ActivitiesType.Updated}); 
  }
  await activitiesService.activitiesCreateDB({ user_id: req?.user?._id as Types.ObjectId,title: "Payment Created", type: ActivitiesType.Created });
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
    await activitiesService.activitiesCreateDB({ user_id: req?.user?._id as Types.ObjectId,title: `Payment Updated`, type: ActivitiesType.Updated }); 
    
}); 
const paymentDelete = catchAsync(async (req: AuthRequest, res) => {
    await addPaymentService.paymentDeleteDB(req.params.id);        
    sendResponse(res, {
        statusCode: 200,
        success: true,     
         message: "Payment deleted successfully",
         data: null,
    }); 
    await activitiesService.activitiesCreateDB({ user_id: req?.user?._id as Types.ObjectId,title: `Payment Deleted`, type: ActivitiesType.Archived }); 
});          


export const addPaymentController = {
  paymentCreate,
  paymentGetAll,
  paymentSingle,
    paymentUpdate,
    paymentDelete
};
