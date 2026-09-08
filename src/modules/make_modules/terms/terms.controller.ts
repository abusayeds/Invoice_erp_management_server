import httpStatus from "http-status";
import { TermsService } from "./terms.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

const createTerms = catchAsync(async (req, res) => {
  const result = await TermsService.createTerms(req.body);

  console.log("Request Body:", typeof req.body, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Terms created successfully.",
    data: result,
  });
});

const getTerms = catchAsync(async (req, res) => {
  const result = await TermsService.getTerms();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms retrieved successfully.",
    data: result,
  });
});

const updateTerms = catchAsync(async (req, res) => {
  const result = await TermsService.updateTerms(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms updated successfully.",
    data: result,
  });
});

const deleteTerms = catchAsync(async (req, res) => {
  await TermsService.deleteTerms();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms deleted successfully.",
    data: null,
  });
});

export const TermsController = {
  createTerms,
  getTerms,
  updateTerms,
  deleteTerms,
};
