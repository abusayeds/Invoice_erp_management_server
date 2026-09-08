import { Schema, model } from "mongoose";
import { TTermsCondition } from "./termsCondition.interface";

const termsConditionSchema = new Schema<TTermsCondition>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    invoice: { type: String, default: "" },
    sales_receipt: { type: String, default: "" },
    proforma_invoice: { type: String, default: "" },
    estimate: { type: String, default: "" },
    delivery_challan: { type: String, default: "" },
    purchase_order: { type: String, default: "" },
    credit_note: { type: String, default: "" },
    bill: { type: String, default: "" },
    debit_note: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const TermsConditionModel = model<TTermsCondition>("SettingTermsCondition", termsConditionSchema);
