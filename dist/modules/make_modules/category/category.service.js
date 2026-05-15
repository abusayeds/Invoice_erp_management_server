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
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const category_model_1 = require("./category.model");
// CREATE
const createCategoryDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.CategoryModel.create(payload);
    return result;
});
// GET ALL
const getAllCategoryDB = (user_id, category) => __awaiter(void 0, void 0, void 0, function* () {
    if (category) {
        return yield category_model_1.CategoryModel.find({ type: category, user_id })
            .sort({ createdAt: -1 });
    }
    else {
        return yield category_model_1.CategoryModel.find({ user_id })
            .select("category")
            .sort({ createdAt: -1 });
    }
});
// GET SINGLE
const getSingleCategoryDB = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    console.log(user_id);
    return yield category_model_1.CategoryModel.findOne({ _id: id, user_id });
});
// UPDATE
const updateCategoryDB = (id, payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield category_model_1.CategoryModel.findOneAndUpdate({ _id: id, user_id }, payload, {
        new: true,
    });
});
// DELETE
const deleteCategoryDB = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield category_model_1.CategoryModel.findOneAndDelete({ _id: id, user_id });
});
exports.categoryService = {
    createCategoryDB,
    getAllCategoryDB,
    getSingleCategoryDB,
    updateCategoryDB,
    deleteCategoryDB,
};
