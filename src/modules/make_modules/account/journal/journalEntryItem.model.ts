import { Schema, model } from "mongoose";
import { TJournalEntryItem } from "./journal.interface";

const schema = new Schema<TJournalEntryItem>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    journal_entry_id: { type: Schema.Types.ObjectId, ref: "JournalEntry", required: true },
    account_id: { type: Schema.Types.ObjectId, ref: "AccountChartOfAccount", required: true },
    description: { type: String, required: true, trim: true },
    debit_amount: { type: Number, default: 0, min: 0 },
    credit_amount: { type: Number, default: 0, min: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ user_id: 1, journal_entry_id: 1 });
schema.index({ user_id: 1, account_id: 1 });

export const JournalEntryItemModel = model<TJournalEntryItem>("JournalEntryItem", schema);
