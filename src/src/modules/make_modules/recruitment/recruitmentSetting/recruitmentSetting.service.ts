import { Types } from "mongoose";
import { companyObjectId } from "../recruitment.utils";
import { RecruitmentSettingModel } from "./recruitmentSetting.model";

const getValue = async (companyId: string | Types.ObjectId, key: string) => {
  const doc = await RecruitmentSettingModel.findOne({ user_id: companyObjectId(companyId), key });
  return doc?.value ?? null;
};

const setValue = async (companyId: string | Types.ObjectId, key: string, value: unknown) => {
  const doc = await RecruitmentSettingModel.findOneAndUpdate(
    { user_id: companyObjectId(companyId), key },
    { $set: { value } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return doc.value;
};

export const recruitmentSettingService = { getValue, setValue };
