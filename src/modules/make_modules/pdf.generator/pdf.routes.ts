import { Request, Response } from "express";
import { PDFSettingModel } from "../pdf.setting/pdf.setting.model";
import { generateInvoicePDF } from "./Invoicepdf";
import AppError from "../../../errors/AppError";
import { generateSalesReceiptPDF } from "./selesReceiptpdf";
import {  pdfTypes } from "../pdf.setting/pdf.setting.interface";
import { generateProformaInvoicePDF } from "./proforma.invoicepdf";
import { generateEstimatePDF } from "./estimatepdf";
import { generateDeliveryChallanPDF } from "./delivery.challan.pdf";
import { generateBillPDF } from "./Bill.pdf";
import { generatePurchaseOrderPDF } from "./purchase.order.pdf";
import { generateCreditNotePDF } from "./credit.note.pdf";
import { generatePaymentReceivedPDF } from "./payment.received.pdf";
import { generatePaymentMoodPDF } from "./payment.made.pdf";
import { authMiddleware, AuthRequest } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { IUser } from "../../basic_modules/user/user.interface";

const express = require("express");
const router = express.Router();

router.post("/invoice", authMiddleware(role.company) , async (req: AuthRequest, res: Response) => {
  const user =  req?.user as IUser
  try {
    const { pdfType } = req.body;

    const settings = await PDFSettingModel.findOne({ pdfType: pdfType , user_id :  user._id }).lean();
   
    if (!settings) {
      throw new AppError(404, "PDF settings not found ");
    }

    switch (pdfType) {
      case pdfTypes.Invoice:
        return await generateInvoicePDF(settings, res);

      case pdfTypes.Sales_Receipt:
        return await generateSalesReceiptPDF(settings, res);

      case pdfTypes.Proforma_Invoice:
        return await generateProformaInvoicePDF(settings, res);

      case pdfTypes.Estimate:
        return await generateEstimatePDF(settings, res);

      case pdfTypes.Delivery_Challan:
        return await generateDeliveryChallanPDF(settings, res);

      case pdfTypes.Bill:
        return await generateBillPDF(settings, res);

      case pdfTypes.Purchase_Order:
        return await generatePurchaseOrderPDF(settings, res);

      case pdfTypes.Credit_Note:
        return await generateCreditNotePDF(settings, res);

      case pdfTypes.Payment_Received:
        return await generatePaymentReceivedPDF(settings, res);

      case pdfTypes.Payment_Made:
        return await generatePaymentMoodPDF(settings, res);

      default:
        throw new AppError(400, "Invalid PDF type");
    }
  } catch (err: any) {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "PDF generation failed", details: err.message });
    }
  }
});

export const PDFRoutes = router;
