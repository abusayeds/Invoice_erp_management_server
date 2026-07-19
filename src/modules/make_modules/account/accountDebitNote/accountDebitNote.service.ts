import { debitNoteService } from "../../debitNote/debitNote.service";
import { TDebitNote } from "../../debitNote/debitNote.interface";

const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const { allRecords, pagination } = await debitNoteService.getAllDB(query, userId);
  return { rows: allRecords, pagination };
};

const getSingleDB = (id: string, userId: string) => debitNoteService.getSingleDB(id, userId);

const createDB = (payload: TDebitNote) => debitNoteService.createDB(payload);

const approveDB = (id: string, userId: string) => debitNoteService.approveDB(id, userId);

const deleteDB = (id: string, userId: string) => debitNoteService.deleteDraftDB(id, userId);

export const accountDebitNoteService = { getAllDB, getSingleDB, createDB, approveDB, deleteDB };
