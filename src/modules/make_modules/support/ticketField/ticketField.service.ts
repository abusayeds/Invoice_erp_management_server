import { TTicketField } from "./ticketField.interface";
import { TicketFieldModel } from "./ticketField.model";

const createDB = async (payload: TTicketField) => TicketFieldModel.create(payload);
const getAllDB = async (user_id: string) => TicketFieldModel.find({ user_id, isDeleted: false }).sort({ order: 1, createdAt: 1 });
const getSingleDB = async (id: string, user_id: string) => TicketFieldModel.findOne({ _id: id, user_id, isDeleted: false });
const updateDB = async (id: string, payload: Partial<TTicketField>, user_id: string) =>
  TicketFieldModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, payload, { new: true });
const deleteDB = async (id: string, user_id: string) =>
  TicketFieldModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });

export const ticketFieldService = { createDB, getAllDB, getSingleDB, updateDB, deleteDB };
