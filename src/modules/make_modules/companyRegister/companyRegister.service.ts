import { Types } from "mongoose";
import { CompanyRegisterModel } from "./companyRegister.model";

const uid = (id: string) => new Types.ObjectId(id);

const createDB = async (userId: string, body: Record<string, unknown>) => {
  const doc = await CompanyRegisterModel.create({ ...body, user_id: uid(userId) });
  return doc.toObject();
};
const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { user_id: uid(userId), isDeleted: { $ne: true } };
  const term = (query.searchTerm as string) ?? "";
  if (term.trim()) {
    const rx = new RegExp(term.trim(), "i");
    filter.$or = [{ business_name: rx }, { email: rx }, { reg_no: rx }, { vat: rx }];
  }
  return CompanyRegisterModel.find(filter).sort({ createdAt: -1 }).lean();
};
const getSingleDB = async (userId: string, id: string) =>
  CompanyRegisterModel.findOne({ _id: id, user_id: uid(userId) }).lean();
const updateDB = async (userId: string, id: string, body: Record<string, unknown>) =>
  CompanyRegisterModel.findOneAndUpdate({ _id: id, user_id: uid(userId) }, { $set: body }, { new: true }).lean();
const deleteDB = async (userId: string, id: string) =>
  CompanyRegisterModel.findOneAndUpdate({ _id: id, user_id: uid(userId) }, { $set: { isDeleted: true } }, { new: true }).lean();

export const companyRegisterService = { createDB, getAllDB, getSingleDB, updateDB, deleteDB };
