import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

// CREATE
const createCategoryDB = async (payload: TCategory) => {
  const result = await CategoryModel.create(payload);
  return result;
};

// GET ALL
const getAllCategoryDB = async ( user_id :  string,category: string) => {
  if (category) {
    return await CategoryModel.find({type: category , user_id})
      .sort({ createdAt: -1 });
  } else {
    return await CategoryModel.find({user_id})
      .select("category")
      .sort({ createdAt: -1 });
  }
};

// GET SINGLE
const getSingleCategoryDB = async (id: string , user_id : string) => {
  console.log(id);
  console.log(user_id);
  
  return await CategoryModel.findOne({_id:id , user_id});
};

// UPDATE
const updateCategoryDB = async (id: string, payload: Partial<TCategory> , user_id : string) => {
  return await CategoryModel.findOneAndUpdate({_id:id , user_id}, payload, {
    new: true
  });
};

// DELETE
const deleteCategoryDB = async (id: string , user_id : string) => {
  return await CategoryModel.findOneAndDelete({_id : id  , user_id});
};

export const categoryService = {
  createCategoryDB,
  getAllCategoryDB,
  getSingleCategoryDB,
  updateCategoryDB,
  deleteCategoryDB,
};
