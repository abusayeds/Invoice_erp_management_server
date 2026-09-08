import { Types } from "mongoose";

export const journalEntryTypes = ["automatic", "manual"] as const;
export type JournalEntryType = (typeof journalEntryTypes)[number];

export const journalStatuses = ["draft", "posted", "reversed"] as const;
export type JournalStatus = (typeof journalStatuses)[number];

export type TJournalEntry = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  journal_number: string;
  journal_date: Date;
  entry_type: JournalEntryType;
  reference_type: string;
  reference_id?: Types.ObjectId;
  description: string;
  total_debit: number;
  total_credit: number;
  status: JournalStatus;
  isDeleted?: boolean;
};

export type TJournalEntryItem = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  journal_entry_id: Types.ObjectId;
  account_id: Types.ObjectId;
  description: string;
  debit_amount: number;
  credit_amount: number;
  isDeleted?: boolean;
};
