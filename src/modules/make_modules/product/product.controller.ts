import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { productService } from "./product.service";

const productCreate = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result = await productService.productCreateDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product created successfully.",
    data: result,
  });
});
const allProduct= catchAsync(async (req: AuthRequest, res) => {
  const result = await productService.allProductDB(req.user?._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All products retrieved successfully.",
    data: result.allProduct,
    pagination: result.pagination
  });
});
const singleProduct= catchAsync(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const result = await productService.singleProductDB(req.user?._id as string, id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single product retrieved successfully.",
    data: result
  });
});
const deleteProduct = catchAsync(async (req: AuthRequest, res) => {
  const result = await productService.deleteProductDB(req.user?._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product deleted successfully.",
    data: result
  });
});

 

export const productController = {
    productCreate,
    allProduct ,
    singleProduct ,
    deleteProduct
}