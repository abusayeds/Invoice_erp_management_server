import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";


// CREATE
const createCategoryDB = async (payload: TCategory) => {
  const result = await CategoryModel.create(payload);
  return result;
};

// GET ALL
const getAllCategoryDB = async () => {
  return await CategoryModel.find().sort({ createdAt: -1 });
};

// GET SINGLE
const getSingleCategoryDB = async (id: string) => {
  return await CategoryModel.findById(id);
};

// UPDATE
const updateCategoryDB = async (id: string, payload: Partial<TCategory>) => {
  return await CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

// DELETE
const deleteCategoryDB = async (id: string) => {
  return await CategoryModel.findByIdAndDelete(id);
};

export const categoryService = {
  createCategoryDB,
  getAllCategoryDB,
  getSingleCategoryDB,
  updateCategoryDB,
  deleteCategoryDB,
};