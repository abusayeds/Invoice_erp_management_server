import { TQuickLink } from "./quickLink.interface";
import { QuickLinkModel } from "./quickLink.model";

const createDB = async (payload: TQuickLink) => QuickLinkModel.create(payload);
const getAllDB = async (user_id: string) => QuickLinkModel.find({ user_id, isDeleted: false }).sort({ order: 1, createdAt: 1 });
const getSingleDB = async (id: string, user_id: string) => QuickLinkModel.findOne({ _id: id, user_id, isDeleted: false });
const updateDB = async (id: string, payload: Partial<TQuickLink>, user_id: string) =>
  QuickLinkModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, payload, { new: true });
const deleteDB = async (id: string, user_id: string) =>
  QuickLinkModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });

export const quickLinkService = { createDB, getAllDB, getSingleDB, updateDB, deleteDB };
