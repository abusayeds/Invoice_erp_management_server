/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import { PDFDocument } from "pdf-lib";
import { AuthRequest } from "../../../middlewares/auth";
import AppError from "../../../errors/AppError";
import { PDFSettingModel } from "../pdf.setting/pdf.setting.model";
import { resolveWebPaymentReceipt, WebPaymentReference } from "./web.payment.receipt.data";
import { renderWebPaymentReceipt } from "./web.payment.receipt.pdf";

/** Optional receipt mode within the existing /pdf/generate API. */
export async function renderWebPaymentReceiptResponse(req: AuthRequest, res: Response) {
  let records: WebPaymentReference[];
  if (req.body.records !== undefined) {
    records = req.body.records;
  } else {
    const rawIds = req.body.ids ?? req.body.id;
    const ids = Array.isArray(rawIds) ? rawIds : typeof rawIds === "string" ? rawIds.split(",") : [];
    records = ids.map(id => ({ id: String(id).trim(), source: req.body.source ?? "received" }));
  }
  if (!Array.isArray(records) || records.length > 100 || (!records.length && req.body.preview !== true)) {
    throw new AppError(400, "Provide 1–100 payment references");
  }
  for (const record of records) {
    if (!record || typeof record.id !== "string" || !["received", "direct"].includes(record.source)) {
      throw new AppError(400, "Invalid payment reference");
    }
  }
  const saved: any = await PDFSettingModel.findOne({ user_id: req.user!._id, pdfType: "Payment_Received" }).lean();
  const settings: any = { ...(saved || {}) };
  // Draft settings affect this PDF only; no settings/payment document is written.
  for (const section of ["style", "header", "company", "contact", "summary", "notes_terms", "signature", "footer", "payment_receipt"]) {
    const draft = req.body.settings?.[section];
    if (draft && typeof draft === "object" && !Array.isArray(draft)) {
      settings[section] = { ...(settings[section] || {}), ...draft };
    }
  }
  const merged = await PDFDocument.create();
  const references = records.length ? records : [undefined];
  for (const reference of references) {
    const data = await resolveWebPaymentReceipt(req.user!, reference);
    const bytes = await renderWebPaymentReceipt(data, settings);
    const part = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(part, part.getPageIndices());
    pages.forEach(page => merged.addPage(page));
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="payment-receipt.pdf"');
  res.end(Buffer.from(await merged.save()));
}
