import { TKnowledgeCategory } from "./knowledgeCategory.interface";
import { KnowledgeCategoryModel } from "./knowledgeCategory.model";

const createDB = async (payload: TKnowledgeCategory) => KnowledgeCategoryModel.create(payload);
const getAllDB = async (user_id: string) => KnowledgeCategoryModel.find({ user_id, isDeleted: false }).sort({ createdAt: -1 });
const getSingleDB = async (id: string, user_id: string) => KnowledgeCategoryModel.findOne({ _id: id, user_id, isDeleted: false });
const updateDB = async (id: string, payload: Partial<TKnowledgeCategory>, user_id: string) =>
  KnowledgeCategoryModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, payload, { new: true });
const deleteDB = async (id: string, user_id: string) =>
  KnowledgeCategoryModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });

export const knowledgeCategoryService = { createDB, getAllDB, getSingleDB, updateDB, deleteDB };
