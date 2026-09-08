import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { trainingFeedbackService } from "./trainingFeedback.service";

const create = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingFeedbackService.create(req, req.params.taskId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Feedback submitted successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res) => {
  const result = await trainingFeedbackService.list(
    req,
    req.params.taskId,
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedbacks retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const trainingFeedbackController = { create, getAll };
