import { TNotes } from "./notes.interface";
import { NotesModel } from "./notes.model";

// One notes config per company. get() returns it (or null), update() upserts the provided fields.
const getDB = async (user_id: string) => {
  return await NotesModel.findOne({ user_id });
};

const updateDB = async (user_id: string, payload: Partial<TNotes>) => {
  return await NotesModel.findOneAndUpdate(
    { user_id },
    { $set: { ...payload, user_id } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

export const notesService = { getDB, updateDB };
