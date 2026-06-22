import httpStatus from "http-status";
import { Types } from "mongoose";
import { Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { ticketService } from "./ticket.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message, data });
const uid = (req: AuthRequest) => req?.user?._id as string;

const create = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req.user?._id;
  req.body.creator_id = req.user?._id;
  ok(res, "Ticket created successfully.", await ticketService.createDB(req.body));
});

const getAll = catchAsync(async (req: AuthRequest, res) =>
  ok(res, "Tickets retrieved successfully.", await ticketService.getAllDB(uid(req), req.query)));

const getSingle = catchAsync(async (req: AuthRequest, res) =>
  ok(res, "Ticket retrieved successfully.", await ticketService.getSingleDB(req.params.id, uid(req))));

const update = catchAsync(async (req: AuthRequest, res) =>
  ok(res, "Ticket updated successfully.", await ticketService.updateDB(req.params.id, req.body, uid(req))));

const remove = catchAsync(async (req: AuthRequest, res) =>
  ok(res, "Ticket deleted successfully.", await ticketService.deleteDB(req.params.id, uid(req))));

const changeStatus = catchAsync(async (req: AuthRequest, res) =>
  ok(res, "Ticket status updated successfully.", await ticketService.changeStatusDB(req.params.id, uid(req), req.body.status)));

const storeNote = catchAsync(async (req: AuthRequest, res) =>
  ok(res, "Ticket note saved successfully.", await ticketService.storeNoteDB(req.params.id, uid(req), req.body.note)));

const addReply = catchAsync(async (req: AuthRequest, res) => {
  const reply = {
    sender: req.body.sender || "admin",
    description: req.body.description,
    attachments: req.body.attachments || [],
    creator_id: req.user?._id as Types.ObjectId,
  };
  ok(res, "Reply added successfully.", await ticketService.addReplyDB(req.params.id, uid(req), reply));
});

const updateReply = catchAsync(async (req: AuthRequest, res) =>
  ok(res, "Reply updated successfully.", await ticketService.updateReplyDB(req.params.id, uid(req), req.params.replyId, req.body)));

const deleteReply = catchAsync(async (req: AuthRequest, res) =>
  ok(res, "Reply deleted successfully.", await ticketService.deleteReplyDB(req.params.id, uid(req), req.params.replyId)));

const deleteAttachment = catchAsync(async (req: AuthRequest, res) =>
  ok(res, "Attachment deleted successfully.", await ticketService.deleteAttachmentDB(req.params.id, uid(req), req.body.path)));

export const ticketController = {
  create, getAll, getSingle, update, remove, changeStatus, storeNote, addReply, updateReply, deleteReply, deleteAttachment,
};
