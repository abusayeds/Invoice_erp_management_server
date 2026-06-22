import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import { TicketModel } from "../ticket/ticket.model";
import { generateTicketId } from "../ticket/ticket.service";
import { KnowledgeModel } from "../knowledge/knowledge.model";
import { FaqModel } from "../faq/faq.model";
import { ContactModel } from "../contact/contact.model";
import { CustomPageModel } from "../customPage/customPage.model";

const POP = [{ path: "category", select: "name color" }];

// A visitor raises a ticket on a company's public portal (no auth).
const createTicketDB = async (companyId: string, body: Record<string, unknown>) => {
  if (!body.name || !body.email || !body.subject || !body.description) {
    throw new AppError(httpStatus.BAD_REQUEST, "name, email, subject and description are required");
  }
  return TicketModel.create({
    user_id: companyId,
    creator_id: companyId,
    ticket_id: generateTicketId(),
    account_type: "custom",
    name: body.name,
    email: body.email,
    subject: body.subject,
    description: body.description,
    category: body.category || undefined,
    attachments: body.attachments || [],
    custom_fields: body.custom_fields || {},
    status: "In Progress",
  });
};

// Look up a ticket by its public ticket_id + email.
const searchDB = async (companyId: string, ticket_id: string, email: string) => {
  if (!ticket_id || !email) throw new AppError(httpStatus.BAD_REQUEST, "ticket_id and email are required");
  const ticket = await TicketModel.findOne({ user_id: companyId, ticket_id, email, isDeleted: false }).populate(POP);
  if (!ticket) throw new AppError(httpStatus.NOT_FOUND, "No ticket found with these details");
  return ticket;
};

const showDB = async (companyId: string, ticket_id: string) => {
  const ticket = await TicketModel.findOne({ user_id: companyId, ticket_id, isDeleted: false }).populate(POP);
  if (!ticket) throw new AppError(httpStatus.NOT_FOUND, "Ticket not found");
  return ticket;
};

const replyDB = async (companyId: string, ticket_id: string, body: Record<string, unknown>) => {
  const ticket = await TicketModel.findOne({ user_id: companyId, ticket_id, isDeleted: false });
  if (!ticket) throw new AppError(httpStatus.NOT_FOUND, "Ticket not found");
  if (!body.description) throw new AppError(httpStatus.BAD_REQUEST, "description is required");
  ticket.conversations?.push({
    sender: "customer",
    description: String(body.description),
    attachments: (body.attachments as { name?: string; path?: string }[]) || [],
  });
  await ticket.save();
  return ticket;
};

const knowledgeListDB = async (companyId: string) =>
  KnowledgeModel.find({ user_id: companyId, isDeleted: false }).populate({ path: "category", select: "title" }).sort({ createdAt: -1 });

const faqListDB = async (companyId: string) =>
  FaqModel.find({ user_id: companyId, isDeleted: false }).sort({ createdAt: -1 });

const contactSubmitDB = async (companyId: string, body: Record<string, unknown>) => {
  if (!body.email) throw new AppError(httpStatus.BAD_REQUEST, "email is required");
  return ContactModel.create({
    user_id: companyId,
    name: body.name,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    subject: body.subject,
    message: body.message,
  });
};

const customPageDB = async (companyId: string, slug: string) => {
  const page = await CustomPageModel.findOne({ user_id: companyId, slug, isDeleted: false });
  if (!page) throw new AppError(httpStatus.NOT_FOUND, "Page not found");
  return page;
};

export const publicSupportService = {
  createTicketDB, searchDB, showDB, replyDB, knowledgeListDB, faqListDB, contactSubmitDB, customPageDB,
};
