import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { taxService } from "./tax.service";

const createTax = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  const result = await taxService.createTaxDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tax created successfully.",
    data: result,
  });
});

const getAllTax = catchAsync(async (req: AuthRequest, res) => {
  const result = await taxService.getAllTaxDB(req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Taxes retrieved successfully.",
    data: result,
  });
});

const getSingleTax = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const result = await taxService.getSingleTaxDB(id, req?.user?._id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tax retrieved successfully.",
    data: result,
  });
});

const updateTax = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const result = await taxService.updateTaxDB(id, req.body, req?.user?._id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tax updated successfully.",
    data: result,
  });
});

const deleteTax = catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const result = await taxService.deleteTaxDB(id, req?.user?._id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tax deleted successfully.",
    data: result,
  });
});

export const taxController = {
  createTax,
  getAllTax,
  getSingleTax,
  updateTax,
  deleteTax,
};
