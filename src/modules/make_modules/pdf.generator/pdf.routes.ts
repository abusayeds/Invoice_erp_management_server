/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Response } from "express";
import { PDFSettingModel } from "../pdf.setting/pdf.setting.model";
import { generateInvoicePDF } from "./Invoicepdf";
import AppError from "../../../errors/AppError";
import { pdfTypes } from "../pdf.setting/pdf.setting.interface";
import { generatePurchaseOrderPDF } from "./purchase.order.pdf";
import { generatePaymentReceivedPDF } from "./payment.received.pdf";
import { generatePaymentMoodPDF } from "./payment.made.pdf";
import { authMiddleware, AuthRequest } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { IUser } from "../../basic_modules/user/user.interface";
import { resolveSalesDoc, isSalesDoc, getSalesDocTypes } from "./pdf.data";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";

const router = express.Router();

// Types that produce a PDF from a built-in sample layout (not yet wired to live data).
const SAMPLE_TYPES = [
  { type: pdfTypes.Purchase_Order, title: "PURCHASE ORDER" },
  { type: pdfTypes.Payment_Received, title: "PAYMENT RECEIVED" },
  { type: pdfTypes.Payment_Made, title: "PAYMENT MADE" },
].map((t) => ({ ...t, dataSource: "sample" as const }));

/**
 * Render a document PDF.
 *  - `type` → pdfTypes enum value
 *  - `id`   → document id; omitted/not-found → blank "N/A" PDF
 * Layout/visibility come from the company's PDF setting (defaults when none exists).
 */
const renderPdf = async (type: string, id: string | undefined, user: IUser, res: Response) => {
  const settings = (await PDFSettingModel.findOne({ pdfType: type, user_id: user._id }).lean()) || {};

  if (isSalesDoc(type)) {
    const data = await resolveSalesDoc(type, id, user);
    return await generateInvoicePDF(data, settings, res);
  }

  // TODO: wire real data for the distinct layouts below — currently sample.
  switch (type) {
    case pdfTypes.Purchase_Order:
      return await generatePurchaseOrderPDF(settings, res);
    case pdfTypes.Payment_Received:
      return await generatePaymentReceivedPDF(settings, res);
    case pdfTypes.Payment_Made:
      return await generatePaymentMoodPDF(settings, res);
    default:
      throw new AppError(400, "Invalid or unsupported PDF type");
  }
};

const handler = async (req: AuthRequest, res: Response) => {
  const user = req?.user as IUser;
  try {
    const type = (req.body.type || req.body.pdfType) as string;
    const id = (req.body.id || req.params.id) as string | undefined;
    if (!type) throw new AppError(400, "type is required");
    await renderPdf(type, id, user, res);
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

// List the document types that can currently generate a PDF (derived from code).
const listTypes = async (_req: AuthRequest, res: Response) => {
  const data = [...getSalesDocTypes(), ...SAMPLE_TYPES];
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supported PDF types retrieved successfully.",
    data,
  });
};

router.get("/types", authMiddleware(role.company), listTypes);
// Unified endpoint: { "type": "Invoice", "id": "<docId>" }  (id optional → blank/N-A PDF)
router.post("/generate", authMiddleware(role.company), handler);
// Back-compat: { "pdfType": "Invoice", "id": "<docId>" }
router.post("/invoice", authMiddleware(role.company), handler);

export const PDFRoutes = router;
