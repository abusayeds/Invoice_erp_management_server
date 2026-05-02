import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AuthRequest } from "../../../middlewares/auth";
import { categoryService } from "./category.service";

// CREATE
const createCategory = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id
  const result = await categoryService.createCategoryDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category created successfully.",
    data: result,
  });
});

// GET ALL
const getAllCategory = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategoryDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully.",
    data: result,
  });
});

// GET SINGLE
const getSingleCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await categoryService.getSingleCategoryDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieved successfully.",
    data: result,
  });
});

// UPDATE
const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await categoryService.updateCategoryDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully.",
    data: result,
  });
});

// DELETE
const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await categoryService.deleteCategoryDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully.",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};