import { TTermsCondition } from "./termsCondition.interface";
import { TermsConditionModel } from "./termsCondition.model";

// One terms-and-conditions config per company. get() returns it (or null), update() upserts.
const getDB = async (user_id: string) => {
  return await TermsConditionModel.findOne({ user_id });
};

const updateDB = async (user_id: string, payload: Partial<TTermsCondition>) => {
  return await TermsConditionModel.findOneAndUpdate(
    { user_id },
    { $set: { ...payload, user_id } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

export const termsConditionService = { getDB, updateDB };
