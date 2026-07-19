
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { activitiesService } from "../activities/activities.service";
import { InvoiceModel } from "../invoice/invoice.model";
import { addPaymentService } from "./payment.service";
import { ActivityAction } from "../activities/activities.interface";
import { ActivityModule } from "../../../utils/activityModules";
import { activityActors } from "../../../utils/activityContext";

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
    await activitiesService.activitiesCreateManyDB([
      {
        ...activityActors(req),
        module: ActivityModule.payment,
        entity_ids: [result._id!],
        action: ActivityAction.created,
        title: "Payment Created",
      },
      {
        ...activityActors(req),
        module: ActivityModule.invoice,
        entity_ids: [req.body.invoice_id],
        action: ActivityAction.updated,
        title: "Invoice marked as paid",
      },
    ]);
  } else {
    await activitiesService.activitiesCreateDB({
      ...activityActors(req),
      module: ActivityModule.payment,
      entity_ids: [result._id!],
      action: ActivityAction.created,
      title: "Payment Created",
    });
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
    await activitiesService.activitiesCreateDB({
      ...activityActors(req),
      module: ActivityModule.payment,
      entity_ids: [result?._id ?? req.params.id],
      action: ActivityAction.updated,
      title: "Payment Updated",
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
    await activitiesService.activitiesCreateDB({
      ...activityActors(req),
      module: ActivityModule.payment,
      entity_ids: [req.params.id],
      action: ActivityAction.archived,
      title: "Payment Deleted",
    });
});          


export const addPaymentController = {
  paymentCreate,
  paymentGetAll,
  paymentSingle,
    paymentUpdate,
    paymentDelete
};
