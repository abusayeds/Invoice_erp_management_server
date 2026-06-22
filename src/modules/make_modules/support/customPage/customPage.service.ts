import { TCustomPage } from "./customPage.interface";
import { CustomPageModel } from "./customPage.model";

const createDB = async (payload: TCustomPage) => CustomPageModel.create(payload);
const getAllDB = async (user_id: string) => CustomPageModel.find({ user_id, isDeleted: false }).sort({ createdAt: -1 });
const getSingleDB = async (id: string, user_id: string) => CustomPageModel.findOne({ _id: id, user_id, isDeleted: false });
const updateDB = async (id: string, payload: Partial<TCustomPage>, user_id: string) =>
  CustomPageModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, payload, { new: true });
const deleteDB = async (id: string, user_id: string) =>
  CustomPageModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });

export const customPageService = { createDB, getAllDB, getSingleDB, updateDB, deleteDB };
