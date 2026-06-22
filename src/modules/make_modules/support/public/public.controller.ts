import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { publicSupportService } from "./public.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message, data });

// Public — no auth. `companyId` (the company's user id) identifies whose portal it is.
const createTicket = catchAsync(async (req: Request, res) =>
  ok(res, "Ticket submitted successfully.", await publicSupportService.createTicketDB(req.params.companyId, req.body)));

const search = catchAsync(async (req: Request, res) =>
  ok(res, "Ticket retrieved successfully.", await publicSupportService.searchDB(req.params.companyId, req.body.ticket_id, req.body.email)));

const show = catchAsync(async (req: Request, res) =>
  ok(res, "Ticket retrieved successfully.", await publicSupportService.showDB(req.params.companyId, req.params.ticketId)));

const reply = catchAsync(async (req: Request, res) =>
  ok(res, "Reply added successfully.", await publicSupportService.replyDB(req.params.companyId, req.params.ticketId, req.body)));

const knowledge = catchAsync(async (req: Request, res) =>
  ok(res, "Knowledge base retrieved successfully.", await publicSupportService.knowledgeListDB(req.params.companyId)));

const faq = catchAsync(async (req: Request, res) =>
  ok(res, "FAQs retrieved successfully.", await publicSupportService.faqListDB(req.params.companyId)));

const contact = catchAsync(async (req: Request, res) =>
  ok(res, "Message submitted successfully.", await publicSupportService.contactSubmitDB(req.params.companyId, req.body)));

const page = catchAsync(async (req: Request, res) =>
  ok(res, "Page retrieved successfully.", await publicSupportService.customPageDB(req.params.companyId, req.params.slug)));

export const publicSupportController = { createTicket, search, show, reply, knowledge, faq, contact, page };
