import { TTax } from "./tax.interface";
import { TaxModel } from "./tax.model";

const createTaxDB = async (payload: TTax) => {
  const result = await TaxModel.create(payload);
  return result;
};

const getAllTaxDB = async (user_id: string) => {
  return await TaxModel.find({ user_id }).sort({ createdAt: -1 });
};

const getSingleTaxDB = async (id: string, user_id: string) => {
  return await TaxModel.findOne({ _id: id, user_id });
};

const updateTaxDB = async (id: string, payload: Partial<TTax>, user_id: string) => {
  return await TaxModel.findOneAndUpdate({ _id: id, user_id }, payload, {
    new: true,
  });
};

const deleteTaxDB = async (id: string, user_id: string) => {
  return await TaxModel.findOneAndDelete({ _id: id, user_id });
};

export const taxService = {
  createTaxDB,
  getAllTaxDB,
  getSingleTaxDB,
  updateTaxDB,
  deleteTaxDB,
};
