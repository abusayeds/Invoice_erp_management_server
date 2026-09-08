import { Schema, model } from "mongoose";
import { journalEntryTypes, journalStatuses, TJournalEntry } from "./journal.interface";

const schema = new Schema<TJournalEntry>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    journal_number: { type: String, required: true, trim: true },
    journal_date: { type: Date, required: true },
    entry_type: { type: String, enum: journalEntryTypes, default: "automatic" },
    reference_type: { type: String, required: true, trim: true },
    reference_id: { type: Schema.Types.ObjectId },
    description: { type: String, required: true, trim: true },
    total_debit: { type: Number, required: true, min: 0 },
    total_credit: { type: Number, required: true, min: 0 },
    status: { type: String, enum: journalStatuses, default: "draft" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ user_id: 1, journal_number: 1 }, { unique: true });
schema.index({ user_id: 1, journal_date: 1, status: 1 });
schema.index({ user_id: 1, reference_type: 1, reference_id: 1 });

export const JournalEntryModel = model<TJournalEntry>("JournalEntry", schema);
