import { TTicketCategory } from "./ticketCategory.interface";
import { TicketCategoryModel } from "./ticketCategory.model";

const createDB = async (payload: TTicketCategory) => TicketCategoryModel.create(payload);
const getAllDB = async (user_id: string) => TicketCategoryModel.find({ user_id, isDeleted: false }).sort({ createdAt: -1 });
const getSingleDB = async (id: string, user_id: string) => TicketCategoryModel.findOne({ _id: id, user_id, isDeleted: false });
const updateDB = async (id: string, payload: Partial<TTicketCategory>, user_id: string) =>
  TicketCategoryModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, payload, { new: true });
const deleteDB = async (id: string, user_id: string) =>
  TicketCategoryModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });

export const ticketCategoryService = { createDB, getAllDB, getSingleDB, updateDB, deleteDB };
