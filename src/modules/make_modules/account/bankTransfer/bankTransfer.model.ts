import { Schema, model } from "mongoose";
import { TBankTransfer, transferStatuses } from "./bankTransfer.interface";

const schema = new Schema<TBankTransfer>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    transfer_number: { type: String, required: true },
    transfer_date: { type: Date, required: true },
    from_account_id: { type: Schema.Types.ObjectId, ref: "AccountBankAccount", required: true },
    to_account_id: { type: Schema.Types.ObjectId, ref: "AccountBankAccount", required: true },
    transfer_amount: { type: Number, required: true, min: 0.01 },
    transfer_charges: { type: Number, default: 0 },
    reference_number: { type: String, trim: true },
    description: { type: String, required: true, maxlength: 500 },
    status: { type: String, enum: transferStatuses, default: "pending" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BankTransferModel = model<TBankTransfer>("AccountBankTransfer", schema);
