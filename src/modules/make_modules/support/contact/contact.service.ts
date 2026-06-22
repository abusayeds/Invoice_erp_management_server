import { TContact } from "./contact.interface";
import { ContactModel } from "./contact.model";

const createDB = async (payload: TContact) => ContactModel.create(payload);
const getAllDB = async (user_id: string) => ContactModel.find({ user_id, isDeleted: false }).sort({ createdAt: -1 });
const getSingleDB = async (id: string, user_id: string) => ContactModel.findOne({ _id: id, user_id, isDeleted: false });
const deleteDB = async (id: string, user_id: string) =>
  ContactModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });

export const contactService = { createDB, getAllDB, getSingleDB, deleteDB };
