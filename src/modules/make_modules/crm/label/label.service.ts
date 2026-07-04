import { TLabel } from "./label.interface";
import { LabelModel } from "./label.model";

const createDB = async (payload: TLabel) => {
  return await LabelModel.create(payload);
};

const getAllDB = async (user_id: string) => {
  return await LabelModel.find({ user_id, isDeleted: false }).sort({ createdAt: -1 });
};

const getSingleDB = async (id: string, user_id: string) => {
  return await LabelModel.findOne({ _id: id, user_id, isDeleted: false });
};

const updateDB = async (id: string, payload: Partial<TLabel>, user_id: string) => {
  return await LabelModel.findOneAndUpdate({ _id: id, user_id }, payload, { new: true });
};

const deleteDB = async (id: string, user_id: string) => {
  return await LabelModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });
};

export const labelService = { createDB, getAllDB, getSingleDB, updateDB, deleteDB };
