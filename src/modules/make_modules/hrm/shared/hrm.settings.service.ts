import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import { HrmCompanySettingsModel } from "../models/master.models";
import { companyObjectId } from "./hrm.utils";

const DEFAULT_WORKING_DAYS = [1, 2, 3, 4, 5];

export const getHrmCompanySettings = async (companyId: string) => {
  const existing = await HrmCompanySettingsModel.findOne({ user_id: companyObjectId(companyId) });
  const doc =
    existing ??
    (await HrmCompanySettingsModel.create({
      user_id: companyObjectId(companyId),
      working_days: DEFAULT_WORKING_DAYS,
      ip_restrict: "off",
    }));
  return {
    working_days: doc.working_days?.length ? doc.working_days : DEFAULT_WORKING_DAYS,
    ip_restrict: doc.ip_restrict === "on" ? "on" : "off",
  };
};

export const updateWorkingDays = async (companyId: string, working_days: number[]) => {
  if (!Array.isArray(working_days) || working_days.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "working_days must be a non-empty array");
  }
  const doc = await HrmCompanySettingsModel.findOneAndUpdate(
    { user_id: companyObjectId(companyId) },
    { $set: { working_days } },
    { upsert: true, new: true }
  ).lean();
  return doc;
};

export const toggleIpRestrict = async (companyId: string, enabled: boolean) => {
  const doc = await HrmCompanySettingsModel.findOneAndUpdate(
    { user_id: companyObjectId(companyId) },
    { $set: { ip_restrict: enabled ? "on" : "off" } },
    { upsert: true, new: true }
  ).lean();
  return doc;
};
