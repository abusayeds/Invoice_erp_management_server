import { creditNoteService } from "../../creditNote/creditNote.service";
import { TCreditNote } from "../../creditNote/creditNote.interface";

const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const { allRecords, pagination } = await creditNoteService.getAllDB(query, userId);
  return { rows: allRecords, pagination };
};

const getSingleDB = (id: string, userId: string) => creditNoteService.getSingleDB(id, userId);

const createDB = (payload: TCreditNote) => creditNoteService.createDB(payload);

const approveDB = (id: string, userId: string) => creditNoteService.approveDB(id, userId);

const deleteDB = (id: string, userId: string) => creditNoteService.deleteDraftDB(id, userId);

export const accountCreditNoteService = { getAllDB, getSingleDB, createDB, approveDB, deleteDB };
