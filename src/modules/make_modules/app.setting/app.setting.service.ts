import { Types } from "mongoose";
import { TSettingType } from "./app.setting.interface";
import { SettingModel } from "./app.setting.model";
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";


// ── Valid subTypes per type ──────────────────────────────

const SUB_TYPE_MAP: Partial<Record<TSettingType, string[]>> = {
  invoice:          ["general", "columns", "summary", "print_email"],
  sales_receipt:    ["general", "columns", "summary", "print_email"],
  estimate:         ["general", "columns", "summary", "print_email"],
  delivery_challan: ["general", "columns", "summary", "print_email"],
  purchase_order:   ["general", "columns", "summary", "print_email"],
  proforma_invoice: ["general", "columns", "summary", "print_email"],
  bill:             ["general", "columns", "summary", "print_email"],
  debit_note:       ["general", "columns", "summary", "print_email"],
  credit_note:      ["general", "columns", "summary", "print_email"],
  product:          ["general", "stock"],
  // subType  — flat
  general:          [],
  modules:          [],
  currency_format:  [],
  whatsApp:         [],
  expense:          [],
};

// ── Validation helper ────────────────────────────────────

const validateTypeAndSubType = (
  type: TSettingType,
  subType?: string
): void => {
  const validSubTypes = SUB_TYPE_MAP[type];

  if (validSubTypes === undefined) {
    throw new Error(`Invalid type: '${type}'`);
  }

  if (subType) {
    if (validSubTypes.length === 0) {
      throw new Error(`Type '${type}' does not support subType`);
    }
    if (!validSubTypes.includes(subType)) {
      throw new Error(
        `Invalid subType '${subType}' for type '${type}'. Valid: ${validSubTypes.join(", ")}`
      );
    }
  }
};

// ── GET ──────────────────────────────────────────────────

 const getSettingService = async (
  user_id: Types.ObjectId,
  type?: TSettingType,
  subType?: string
) => {
    if (!type) {
     throw new AppError(httpStatus.BAD_REQUEST ,  "Type is required ! ")
  }

  validateTypeAndSubType(type, subType);

  if (subType) {
    const data = await SettingModel.findOne({ user_id })
      .select(`${type}.${subType}`)
      .lean();
    if (!data) return null;

    return { [subType]: (data[type] as any)?.[subType] };
  }

  const data = await SettingModel.findOne({ user_id })
    .select(type)
    .lean();
  if (!data) return null;

  return data[type];
};

// ── UPDATE ───────────────────────────────────────────────

 const updateSettingService = async (
  user_id: Types.ObjectId,
  type: TSettingType,
  payload: Record<string, any>,
  subType?: string
) => {
  validateTypeAndSubType(type, subType);

  const dotNotationUpdate: Record<string, any> = {};

  if (subType) {
    // ?type=invoice&subType=general
    // payload: { due_date: true, shipping_address: false }
    // → "invoice.general.due_date": true
    for (const [key, value] of Object.entries(payload)) {
      dotNotationUpdate[`${type}.${subType}.${key}`] = value;
    }
  } else {
    // ?type=invoice (subType)
    // payload: { "general.due_date": true }flat module payload
    for (const [key, value] of Object.entries(payload)) {
      dotNotationUpdate[`${type}.${key}`] = value;
    }
  }

  const updated = await SettingModel.findOneAndUpdate(
    { user_id },
    { $set: dotNotationUpdate },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  if (!updated) return null;
  if (subType) {
    return {
      [type]: {
        [subType]: (updated[type] as any)?.[subType],
      },
    };
  }

  return { [type]: updated[type] };
};

export const settingService =  {
getSettingService , updateSettingService
} 