/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Response } from "express";
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
import { resolveSalesDoc, isSalesDoc, getSalesDocTypes } from "./pdf.data";
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

const handler = async (req: AuthRequest, res: Response) => {
  const user = req?.user as IUser;
  try {
    const type = (req.body.type || req.body.pdfType) as string;
    const id = (req.body.ids || req.params.ids) as string | undefined;
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
