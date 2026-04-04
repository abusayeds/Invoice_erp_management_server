import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { IUser } from "../../basic_modules/user/user.interface";
import { AuthRequest } from "../../../middlewares/auth";
import { SubscriptionModel } from "../subscription/subscription.model";
import AppError from "../../../errors/AppError";
import { paymentService } from "../payment/payment.service";
import { SubscriptionPlan, TSubscription } from "../subscription/subscription.interface";
import { Types } from "mongoose";

const purchaseSubscription = catchAsync(async (req : AuthRequest, res) => {
const { subscriptionId } = req.body;
const findSubscription = await SubscriptionModel.findById(subscriptionId) as TSubscription;
if (!findSubscription) {
  throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
}
const now = new Date();
let endDate = new Date(now);
switch (findSubscription.plan) {
  case SubscriptionPlan.FREE:
    endDate.setDate(endDate.getDate() + 7);
    break;

  case SubscriptionPlan.MONTHLY:
    endDate.setMonth(endDate.getMonth() + 1);
    break;

  case SubscriptionPlan.YEARLY:
    endDate.setFullYear(endDate.getFullYear() + 1);
    break;

  default:
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid plan type");
}

const finalData = {
  user_id: new Types.ObjectId(req.user!._id as string),
  price: findSubscription.price,
  plan: findSubscription.plan,
  businesses: findSubscription.businesses,
  invoices: findSubscription.invoices,
  contacts: findSubscription.contacts, 
  estimates: findSubscription.estimates,
  proformaInvoices: findSubscription.proformaInvoices,
  endDate: endDate,
  cancelUrl : req.body.cancelUrl,
  successUrl : req.body.successUrl
};
  const user = req?.user as IUser
  const result = await paymentService.payment(finalData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment session created successfully",
    data: result,
  });
});








export const purchaseController = {
  purchaseSubscription,
};
