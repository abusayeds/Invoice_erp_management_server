import { TKnowledge } from "./knowledge.interface";
import { KnowledgeModel } from "./knowledge.model";

const POP = [{ path: "category", select: "title" }];

const createDB = async (payload: TKnowledge) => KnowledgeModel.create(payload);
const getAllDB = async (user_id: string) => KnowledgeModel.find({ user_id, isDeleted: false }).populate(POP).sort({ createdAt: -1 });
const getSingleDB = async (id: string, user_id: string) => KnowledgeModel.findOne({ _id: id, user_id, isDeleted: false }).populate(POP);
const updateDB = async (id: string, payload: Partial<TKnowledge>, user_id: string) =>
  KnowledgeModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, payload, { new: true });
const deleteDB = async (id: string, user_id: string) =>
  KnowledgeModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });

export const knowledgeService = { createDB, getAllDB, getSingleDB, updateDB, deleteDB };
