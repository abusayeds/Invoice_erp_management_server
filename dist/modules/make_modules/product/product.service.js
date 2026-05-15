"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const category_model_1 = require("../category/category.model");
const product_model_1 = require("./product.model");
const queryBuilder_1 = __importDefault(require("../../../builder/queryBuilder"));
const productCreateDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistCategory = yield category_model_1.CategoryModel.findOne({ categoryName: payload.category });
    if (!isExistCategory) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    const result = yield product_model_1.ProductModel.create(payload);
    return result;
});
const allProductDB = (user_id, query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new queryBuilder_1.default(product_model_1.ProductModel.find({ user_id, isArchive: false, isDeleted: false }), query).search(["productName", "category", "sku"]).filter().sort().fields();
    const { totalData } = yield productQuery.paginate(product_model_1.ProductModel.find({ user_id, isArchive: false, isDeleted: false }));
    const allProduct = yield productQuery.modelQuery.exec();
    const currentPage = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = productQuery.calculatePagination({ totalData, currentPage, limit });
    return { allProduct, pagination };
});
const singleProductDB = (user_id, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.findOne({ user_id, _id: id, isArchive: false, isDeleted: false });
    return result;
});
const deleteProductDB = (user_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.findOneAndUpdate({ user_id, _id: payload._id }, payload, { new: true });
    return result;
});
exports.productService = {
    productCreateDB,
    allProductDB,
    singleProductDB,
    deleteProductDB
};
