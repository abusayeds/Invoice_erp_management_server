import { Schema, model } from "mongoose";
import { TBalanceSheetNote } from "../doubleEntry.types";

const schema = new Schema<TBalanceSheetNote>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    balance_sheet_id: { type: Schema.Types.ObjectId, ref: "BalanceSheet", required: true },
    note_number: { type: Number, required: true },
    note_title: { type: String, required: true, trim: true },
    note_content: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BalanceSheetNoteModel = model<TBalanceSheetNote>("BalanceSheetNote", schema);
