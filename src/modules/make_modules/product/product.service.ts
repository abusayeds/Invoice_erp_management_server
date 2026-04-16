import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { CategoryModel } from "../category/category.model";
import { TProduct } from "./product.interface"
import { ProductModel } from "./product.model";

const productCreateDB = async (payload : TProduct) => {
  const isExistCategory = await CategoryModel.findOne({ categoryName: payload.category });
  if (!isExistCategory) {throw new AppError( httpStatus.NOT_FOUND ,"Category not found")}
  const result = await ProductModel.create(payload);
  return result;
}

const allProductDB = async () => {
  return await ProductModel.find();
}

export const productService  = {
    productCreateDB,
    allProductDB
}