import express from "express";
import { publicSupportController } from "./public.controller";

// No auth — public support portal, scoped by :companyId (the company's user id).
const router = express.Router();

router.post("/:companyId/tickets", publicSupportController.createTicket);
router.post("/:companyId/tickets/search", publicSupportController.search);
router.get("/:companyId/tickets/:ticketId", publicSupportController.show);
router.post("/:companyId/tickets/:ticketId/reply", publicSupportController.reply);
router.get("/:companyId/knowledge", publicSupportController.knowledge);
router.get("/:companyId/faq", publicSupportController.faq);
router.post("/:companyId/contact", publicSupportController.contact);
router.get("/:companyId/page/:slug", publicSupportController.page);

export const publicSupportRoutes = router;
