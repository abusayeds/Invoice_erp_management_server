import express from "express";
import { ticketRoutes } from "./ticket/ticket.route";
import { ticketCategoryRoutes } from "./ticketCategory/ticketCategory.route";
import { knowledgeRoutes } from "./knowledge/knowledge.route";
import { knowledgeCategoryRoutes } from "./knowledgeCategory/knowledgeCategory.route";
import { faqRoutes } from "./faq/faq.route";
import { contactRoutes } from "./contact/contact.route";
import { customPageRoutes } from "./customPage/customPage.route";
import { quickLinkRoutes } from "./quickLink/quickLink.route";
import { ticketFieldRoutes } from "./ticketField/ticketField.route";
import { supportSettingRoutes } from "./settings/settings.route";
import { publicSupportRoutes } from "./public/public.route";

const router = express.Router();

// Tickets
router.use("/tickets", ticketRoutes);
router.use("/ticket-categories", ticketCategoryRoutes);
router.use("/ticket-fields", ticketFieldRoutes);

// Knowledge base & FAQ
router.use("/knowledge", knowledgeRoutes);
router.use("/knowledge-categories", knowledgeCategoryRoutes);
router.use("/faq", faqRoutes);

// Contact submissions
router.use("/contact", contactRoutes);

// Portal setup
router.use("/custom-pages", customPageRoutes);
router.use("/quick-links", quickLinkRoutes);
router.use("/settings", supportSettingRoutes);

// Public portal (no auth)
router.use("/public", publicSupportRoutes);

export const supportRoutes = router;
