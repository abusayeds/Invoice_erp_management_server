import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { subscriptionService } from "./subscription.service";

const createSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.createSubscriptionDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Subscription created successfully.",
    data: result,
  });
});

const getAllSubscriptions = catchAsync(async (req, res) => {
  const result = await subscriptionService.getAllSubscriptionsDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscriptions fetched successfully.",
    data: result,
  });
});

const getSingleSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await subscriptionService.getSingleSubscriptionDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscription fetched successfully.",
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await subscriptionService.updateSubscriptionDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscription updated successfully.",
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await subscriptionService.deleteSubscriptionDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscription deleted successfully.",
    data: result,
  });
});

export const subscriptionController = {
  createSubscription,
  getAllSubscriptions,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
};