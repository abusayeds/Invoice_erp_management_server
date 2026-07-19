import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TProduct } from "./product.interface"
import { ProductModel } from "./product.model";
import queryBuilder from "../../../builder/queryBuilder";
import { CategoryModel } from "./category/category.model";
import { TaxModel } from "./tax/tax.model";
import { taxTypesForProduct } from "./tax/tax.interface";
import { withBulkDeleteIdSecond } from "../../../utils/bulkDelete";

const productCreateDB = async (payload : TProduct) => {
  const isExistCategory = await CategoryModel.findOne({ _id: payload.category });
  if (!isExistCategory) {throw new AppError( httpStatus.NOT_FOUND ,"Category not found")}
  if (payload.tax) {
    const isExistTax = await TaxModel.findOne({
      _id: payload.tax,
      user_id: payload.user_id,
      type: { $in: [...taxTypesForProduct] },
    });
    if (!isExistTax) {throw new AppError( httpStatus.NOT_FOUND ,"Tax not found")}
  }
  const result = await ProductModel.create(payload);
  return result;
}

const allProductDB = async (user_id :  string , query : Record<string, unknown>) => {
 const productQuery  =  new queryBuilder(ProductModel.find({ user_id, isArchive: false , isDeleted : false } ), query);
 await productQuery.searchNested({
   localFields: ["productName", "sku"],
   refs: [
     {
       foreignField: "category",
       model: CategoryModel as never,
       fields: ["category"],
     },
   ],
 });
 productQuery.filter().sort().fields();
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
const deleteProductDBOne = async (user_id :  string , id : string) => {
  const result = await ProductModel.findOneAndUpdate({ user_id, _id: id } , { isDeleted: true } , {new : true} );
  return result;
}
const updateProductDB = async (user_id : string , id : string , payload : TProduct) => {
  const existing = await ProductModel.findOne({ user_id, _id: id });
  if (!existing) {throw new AppError(httpStatus.NOT_FOUND, "Product not found")}
  if (payload.category) {
    const isExistCategory = await CategoryModel.findOne({ _id: payload.category });
    if (!isExistCategory) {throw new AppError(httpStatus.NOT_FOUND, "Category not found")}
  }
  if (payload.tax) {
    const isExistTax = await TaxModel.findOne({
      _id: payload.tax,
      user_id,
      type: { $in: [...taxTypesForProduct] }
    });
    if (!isExistTax) {throw new AppError(httpStatus.NOT_FOUND, "Tax not found")}
  }
  const result = await ProductModel.findOneAndUpdate(
    { user_id, _id: id },
    payload,
    { new: true, runValidators: true }
  );
  return result;
}
const deleteProductDB = withBulkDeleteIdSecond(deleteProductDBOne);

export const productService  = {
    productCreateDB,
    allProductDB  ,
    singleProductDB ,
    deleteProductDB ,
    updateProductDB
}