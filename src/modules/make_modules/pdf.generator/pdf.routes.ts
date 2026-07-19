/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Response } from "express";
import { PassThrough } from "stream";
import { PDFDocument as PDFLibDocument } from "pdf-lib";
import { PDFSettingModel } from "../pdf.setting/pdf.setting.model";
import { generateInvoicePDF } from "./Invoicepdf";
import AppError from "../../../errors/AppError";
import { pdfTypes } from "../pdf.setting/pdf.setting.interface";
import { generatePaymentMoodPDF } from "./payment.made.pdf";
import { generatePaymentReceiptPDF } from "./payment.received.pdf";
import { resolvePaymentReceiptData } from "./payment.receipt.data";
import { authMiddleware, AuthRequest } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { IUser } from "../../basic_modules/user/user.interface";
import { resolveSalesDoc, isSalesDoc, getSalesDocTypes, getDocConfig } from "./pdf.data";
import { PaymentModel } from "../addPayment/payment.model";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";

const router = express.Router();

const SAMPLE_TYPES = [
  { type: pdfTypes.Payment_Made, title: "PAYMENT MADE", dataSource: "sample" as const },
];

const PAYMENT_RECEIPT_TYPE = {
  type: pdfTypes.Payment_Received,
  title: "PAYMENT RECEIPT",
  dataSource: "live" as const,
};

/**
 * Render a document PDF.
 *  - `type` → pdfTypes enum value
 *  - `id`   → document id; omitted/not-found → blank "N/A" PDF
 * Payment_Received → PaymentModel + receipt layout (not invoice-style).
 */
const renderPdf = async (type: string, id: string | undefined, user: IUser, res: Response) => {
  const settings = (await PDFSettingModel.findOne({ pdfType: type, user_id: user._id }).lean()) || {};

  if (type === pdfTypes.Payment_Received) {
    const data = await resolvePaymentReceiptData(id, user);
    return await generatePaymentReceiptPDF(data, settings, res);
  }

  if (isSalesDoc(type)) {
    const data = await resolveSalesDoc(type, id, user);
    return await generateInvoicePDF(data, settings, res);
  }

  switch (type) {
    case pdfTypes.Payment_Made:
      return await generatePaymentMoodPDF(settings, res);
    default:
      throw new AppError(400, "Invalid or unsupported PDF type");
  }
};

/** Render one document into a Buffer (same renderPdf, piped to memory instead of res). */
const renderPdfToBuffer = (type: string, id: string, user: IUser): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
    // Generators only call res.setHeader() and pipe — a PassThrough with a no-op setHeader is enough.
    const fakeRes = Object.assign(stream, { setHeader: () => fakeRes });
    renderPdf(type, id, user, fakeRes as unknown as Response).catch(reject);
  });

/** "INVOICE" → "Invoice", "SALES RECEIPT" → "Sales Receipt" — label for the download filename. */
const typeLabel = (type: string): string => {
  const title =
    type === pdfTypes.Payment_Received ? "PAYMENT RECEIPT" : getDocConfig(type)?.title || type.split("_").join(" ");
  return title
    .toLowerCase()
    .replace(/(^|\s)\w/g, (ch: string) => ch.toUpperCase());
};

/** Document numbers (invoice_number / payment_number) for the filename, in the ids' order. */
const docNumbersFor = async (type: string, ids: string[], user: IUser): Promise<string[]> => {
  try {
    let docs: any[] = [];
    if (type === pdfTypes.Payment_Received) {
      docs = await PaymentModel.find({ _id: { $in: ids }, user_id: user._id })
        .select("payment_number").lean();
    } else if (isSalesDoc(type)) {
      docs = await getDocConfig(type)!.model.find({ _id: { $in: ids }, user_id: user._id })
        .select("invoice_number").lean();
    }
    const byId = new Map(docs.map((d: any) => [String(d._id), d.invoice_number || d.payment_number]));
    return ids.map((id) => byId.get(id)).filter(Boolean) as string[];
  } catch (_err) {
    return [];
  }
};

/** e.g. "Invoice# INV-0001, INV-0002.pdf" — mirrors the Moon Invoice download name. */
const buildPdfFilename = async (type: string, ids: string[], user: IUser): Promise<string> => {
  const label = typeLabel(type);
  const numbers = await docNumbersFor(type, ids, user);
  const name = numbers.length ? `${label}# ${numbers.join(", ")}` : label;
  return `${name.replace(/[\\/:*?"<>|]/g, "-")}.pdf`;
};

const sendPdfBuffer = (res: Response, bytes: Uint8Array | Buffer, filename: string) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
  res.end(Buffer.from(bytes));
};

/** One or more ids → each document rendered on its own page(s), merged into one PDF. */
const renderMergedPdf = async (type: string, ids: string[], user: IUser, res: Response) => {
  const merged = await PDFLibDocument.create();
  for (const id of ids) {
    const buffer = await renderPdfToBuffer(type, id, user);
    const part = await PDFLibDocument.load(buffer);
    const pages = await merged.copyPages(part, part.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  const bytes = await merged.save();
  sendPdfBuffer(res, bytes, await buildPdfFilename(type, ids, user));
};

/** `ids` body field: array, comma-separated string, or single id string. */
const parseIds = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.map((v) => String(v).trim()).filter(Boolean);
  if (typeof raw === "string") return raw.split(",").map((v) => v.trim()).filter(Boolean);
  return [];
};

const handler = async (req: AuthRequest, res: Response) => {
  const user = req?.user as IUser;
  try {
    const type = (req.body.type || req.body.pdfType) as string;
    if (!type) throw new AppError(400, "type is required");

    const ids = parseIds(req.body.ids ?? req.params.ids ?? req.body.id);
    if (ids.length > 0) {
      // Single id → one-page PDF; N ids → N invoices, each on its own page —
      // downloaded as one file named like "Invoice# INV-0001, INV-0002.pdf".
      return await renderMergedPdf(type, ids, user, res);
    }

    await renderPdf(type, undefined, user, res);
  } catch (err: any) {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      res.status(err?.statusCode || 500).json({
        success: false,
        message: "PDF generation failed",
        details: err?.message,
      });
    }
  }
};

const listTypes = async (_req: AuthRequest, res: Response) => {
  const data = [...getSalesDocTypes(), PAYMENT_RECEIPT_TYPE, ...SAMPLE_TYPES];
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supported PDF types retrieved successfully.",
    data,
  });
};

router.get("/types", authMiddleware(role.company), listTypes);

router.post("/generate", authMiddleware(role.company), handler);

router.post("/invoice", authMiddleware(role.company), handler);

export const PDFRoutes = router;
