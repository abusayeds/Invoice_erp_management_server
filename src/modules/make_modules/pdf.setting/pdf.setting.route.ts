import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { pdfSettingController } from "./pdf.setting.controller";

const router = express.Router();

router.patch("/:pdfType",authMiddleware(role.company), pdfSettingController.PdfSettingUpdate);


export const PDFSettingRoutes = router;