"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFRoutes = void 0;
const pdf_setting_model_1 = require("../pdf.setting/pdf.setting.model");
const Invoicepdf_1 = require("./Invoicepdf");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const selesReceiptpdf_1 = require("./selesReceiptpdf");
const pdf_setting_interface_1 = require("../pdf.setting/pdf.setting.interface");
const proforma_invoicepdf_1 = require("./proforma.invoicepdf");
const estimatepdf_1 = require("./estimatepdf");
const delivery_challan_pdf_1 = require("./delivery.challan.pdf");
const Bill_pdf_1 = require("./Bill.pdf");
const purchase_order_pdf_1 = require("./purchase.order.pdf");
const credit_note_pdf_1 = require("./credit.note.pdf");
const payment_received_pdf_1 = require("./payment.received.pdf");
const payment_made_pdf_1 = require("./payment.made.pdf");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const express = require("express");
const router = express.Router();
router.post("/invoice", (0, auth_1.authMiddleware)(role_1.role.company), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    try {
        const { pdfType } = req.body;
        const settings = yield pdf_setting_model_1.PDFSettingModel.findOne({ pdfType: pdfType, user_id: user._id }).lean();
        if (!settings) {
            throw new AppError_1.default(404, "PDF settings not found ");
        }
        switch (pdfType) {
            case pdf_setting_interface_1.pdfTypes.Invoice:
                return yield (0, Invoicepdf_1.generateInvoicePDF)(settings, res);
            case pdf_setting_interface_1.pdfTypes.Sales_Receipt:
                return yield (0, selesReceiptpdf_1.generateSalesReceiptPDF)(settings, res);
            case pdf_setting_interface_1.pdfTypes.Proforma_Invoice:
                return yield (0, proforma_invoicepdf_1.generateProformaInvoicePDF)(settings, res);
            case pdf_setting_interface_1.pdfTypes.Estimate:
                return yield (0, estimatepdf_1.generateEstimatePDF)(settings, res);
            case pdf_setting_interface_1.pdfTypes.Delivery_Challan:
                return yield (0, delivery_challan_pdf_1.generateDeliveryChallanPDF)(settings, res);
            case pdf_setting_interface_1.pdfTypes.Bill:
                return yield (0, Bill_pdf_1.generateBillPDF)(settings, res);
            case pdf_setting_interface_1.pdfTypes.Purchase_Order:
                return yield (0, purchase_order_pdf_1.generatePurchaseOrderPDF)(settings, res);
            case pdf_setting_interface_1.pdfTypes.Credit_Note:
                return yield (0, credit_note_pdf_1.generateCreditNotePDF)(settings, res);
            case pdf_setting_interface_1.pdfTypes.Payment_Received:
                return yield (0, payment_received_pdf_1.generatePaymentReceivedPDF)(settings, res);
            case pdf_setting_interface_1.pdfTypes.Payment_Made:
                return yield (0, payment_made_pdf_1.generatePaymentMoodPDF)(settings, res);
            default:
                throw new AppError_1.default(400, "Invalid PDF type");
        }
    }
    catch (err) {
        console.error("PDF generation error:", err);
        if (!res.headersSent) {
            res
                .status(500)
                .json({ error: "PDF generation failed", details: err.message });
        }
    }
}));
exports.PDFRoutes = router;
