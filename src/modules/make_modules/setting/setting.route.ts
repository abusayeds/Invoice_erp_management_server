import express from "express";

// New settings sections
import { paymentMethodRoutes } from "./paymentMethod/paymentMethod.route";
import { signatureRoutes } from "./signature/signature.route";
import { bankDetailsRoutes } from "./bankDetails/bankDetails.route";
import { notesRoutes } from "./notes/notes.route";
import { termsConditionRoutes } from "./termsCondition/termsCondition.route";
import { emailTemplateRoutes } from "./emailTemplate/emailTemplate.route";

// Existing settings modules, unified under /api/v1/setting/* (files left in place to avoid
// breaking the settings-seeding, PDF-generation and purchase flows that import them).
import { settingRoutes as appSettingRoutes } from "../app.setting/app.setting.route";
import { PDFSettingRoutes } from "../pdf.setting/pdf.setting.route";
import { taxRoutes } from "../product/tax/tax.route";

const router = express.Router();

router.use("/app", appSettingRoutes);
router.use("/pdf", PDFSettingRoutes);
router.use("/tax", taxRoutes);
router.use("/payment-methods", paymentMethodRoutes);
router.use("/signatures", signatureRoutes);
router.use("/bank-details", bankDetailsRoutes);
router.use("/notes", notesRoutes);
router.use("/terms-conditions", termsConditionRoutes);
router.use("/email-templates", emailTemplateRoutes);

export const settingHubRoutes = router;
