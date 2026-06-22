import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import { TTicket, TTicketConversation } from "./ticket.interface";
import { TicketModel } from "./ticket.model";

const POP = [
  { path: "category", select: "name color" },
  { path: "ticket_user_id", select: "name email" },
];

export const generateTicketId = () => `TKT-${Date.now()}`;

const createDB = async (payload: TTicket) => {
  if (!payload.ticket_id) payload.ticket_id = generateTicketId();
  return TicketModel.create(payload);
};

const getAllDB = async (user_id: string, query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { user_id, isDeleted: false };
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  return TicketModel.find(filter).populate(POP).sort({ createdAt: -1 });
};

const getSingleDB = async (id: string, user_id: string) =>
  TicketModel.findOne({ _id: id, user_id, isDeleted: false }).populate(POP);

const updateDB = async (id: string, payload: Partial<TTicket>, user_id: string) =>
  TicketModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, payload, { new: true, runValidators: true });

const deleteDB = async (id: string, user_id: string) =>
  TicketModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { isDeleted: true }, { new: true });

const changeStatusDB = async (id: string, user_id: string, status: string) =>
  TicketModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { status }, { new: true });

const storeNoteDB = async (id: string, user_id: string, note: string) =>
  TicketModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { note }, { new: true });

const addReplyDB = async (id: string, user_id: string, reply: TTicketConversation) =>
  TicketModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { $push: { conversations: reply } }, { new: true });

const updateReplyDB = async (id: string, user_id: string, replyId: string, data: Record<string, unknown>) => {
  const set: Record<string, unknown> = {};
  for (const k of Object.keys(data || {})) set[`conversations.$[el].${k}`] = data[k];
  return TicketModel.findOneAndUpdate(
    { _id: id, user_id, isDeleted: false },
    { $set: set },
    { new: true, arrayFilters: [{ "el._id": replyId }] }
  );
};

const deleteReplyDB = async (id: string, user_id: string, replyId: string) =>
  TicketModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { $pull: { conversations: { _id: replyId } } }, { new: true });

const deleteAttachmentDB = async (id: string, user_id: string, path: string) =>
  TicketModel.findOneAndUpdate({ _id: id, user_id, isDeleted: false }, { $pull: { attachments: { path } } }, { new: true });

const ensureOwned = async (id: string, user_id: string) => {
  const t = await TicketModel.findOne({ _id: id, user_id, isDeleted: false });
  if (!t) throw new AppError(httpStatus.NOT_FOUND, "Ticket not found");
  return t;
};

export const ticketService = {
  createDB, getAllDB, getSingleDB, updateDB, deleteDB, changeStatusDB, storeNoteDB,
  addReplyDB, updateReplyDB, deleteReplyDB, deleteAttachmentDB, ensureOwned,
};
