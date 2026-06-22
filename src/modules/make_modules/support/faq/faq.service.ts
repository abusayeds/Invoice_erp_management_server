import { TFaq } from "./faq.interface";
import { FaqModel } from "./faq.model";

const createDB = async (payload: TFaq) => FaqModel.create(payload);
const getAllDB = async (user_id: string) => FaqModel.find({ user_id, isDeleted: false }).sort({ createdAt: -1 });
const getSingleDB = async (id: string, user_id: string) => FaqModel.findOne({ _id: id, user_id, isDeleted: false });
const updateDB = async (id: string, payload: Partial<TFaq>, user_id: string) =>
  FaqModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, payload, { new: true });
const deleteDB = async (id: string, user_id: string) =>
  FaqModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });

export const faqService = { createDB, getAllDB, getSingleDB, updateDB, deleteDB };
