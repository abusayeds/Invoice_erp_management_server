import { TBankDetails } from "./bankDetails.interface";
import { BankDetailsModel } from "./bankDetails.model";

// One bank-details config per company. get() returns it (or null), update() upserts.
const getDB = async (user_id: string) => {
  return await BankDetailsModel.findOne({ user_id });
};

const updateDB = async (user_id: string, payload: Partial<TBankDetails>) => {
  return await BankDetailsModel.findOneAndUpdate(
    { user_id },
    { $set: { ...payload, user_id } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

export const bankDetailsService = { getDB, updateDB };
