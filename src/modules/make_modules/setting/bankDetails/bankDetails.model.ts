import { Schema, model } from "mongoose";
import { TBankDetails } from "./bankDetails.interface";

const bankDetailsSchema = new Schema<TBankDetails>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    content: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const BankDetailsModel = model<TBankDetails>("BankDetails", bankDetailsSchema);
