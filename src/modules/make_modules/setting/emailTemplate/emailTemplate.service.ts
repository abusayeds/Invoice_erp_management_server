import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import { emailTemplateTypes } from "./emailTemplate.interface";
import { EmailTemplateModel } from "./emailTemplate.model";

// One email-template config per company. get() returns it (or null).
const getDB = async (user_id: string) => {
  return await EmailTemplateModel.findOne({ user_id });
};

/**
 * Section-wise upsert (matches the Laravel UI which edits one section at a time):
 *  - type "settings"  -> data goes to `settings`
 *  - type "signature" -> data (string) goes to `signature`
 *  - type <document>  -> data goes to `templates.<document>`
 */
const updateDB = async (user_id: string, type: string, data: unknown) => {
  if (!type) {
    throw new AppError(httpStatus.BAD_REQUEST, "type is required");
  }

  let setObj: Record<string, unknown>;
  if (type === "settings") {
    setObj = { settings: data };
  } else if (type === "signature") {
    setObj = { signature: data };
  } else if ((emailTemplateTypes as readonly string[]).includes(type)) {
    setObj = { [`templates.${type}`]: data };
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid type. Allowed: settings, signature, ${emailTemplateTypes.join(", ")}`
    );
  }

  return await EmailTemplateModel.findOneAndUpdate(
    { user_id },
    { $set: { ...setObj, user_id } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

export const emailTemplateService = { getDB, updateDB };
