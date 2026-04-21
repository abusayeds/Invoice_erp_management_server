import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { CategoryModel } from "../category/category.model";
import { TProduct } from "./product.interface"
import { ProductModel } from "./product.model";
import queryBuilder from "../../../builder/queryBuilder";

const productCreateDB = async (payload : TProduct) => {
  const isExistCategory = await CategoryModel.findOne({ categoryName: payload.category });
  if (!isExistCategory) {throw new AppError( httpStatus.NOT_FOUND ,"Category not found")}
  const result = await ProductModel.create(payload);
  return result;
}

const allProductDB = async (user_id :  string , query : Record<string, unknown>) => {
 const productQuery  =  new queryBuilder(ProductModel.find({ user_id, isArchive: false , isDeleted : false } ), query) .search(["productName", "category", "sku"]).filter().sort().fields();
 const {totalData } = await productQuery.paginate(ProductModel.find({ user_id, isArchive: false , isDeleted : false } ));
 const allProduct = await productQuery.modelQuery.exec();
 const currentPage = Number(query?.page) || 1;
 const limit = Number(query.limit) || 10;
 const pagination = productQuery.calculatePagination({ totalData, currentPage, limit });
 return { allProduct, pagination }
}
const singleProductDB = async (user_id :  string , id : string) => {
  const result = await ProductModel.findOne({ user_id, _id: id , isArchive: false , isDeleted : false } );
  return result;
}
const deleteProductDB = async (user_id :  string , payload : TProduct) => {
  const result = await ProductModel.findOneAndUpdate({ user_id, _id: payload._id } , payload , {new : true} );
  return result;
}
export const productService  = {
    productCreateDB,
    allProductDB  ,
    singleProductDB ,
    deleteProductDB
}