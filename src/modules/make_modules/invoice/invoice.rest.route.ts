import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { invoiceController } from "./invoice.controller";

/**
 * RESTful aliases mounted at `/invoices` for the web frontend (`GET /`,
 * `GET /:id`, `POST /`, `PATCH|PUT /:id`, `DELETE /:id`), reusing the existing
 * invoice controller handlers.
 *
 * The mobile app keeps using the original `/invoice/*` routes
 * (`/all`, `/single/:id`, `/create`, `/edit/:id`, `/delete/:id`, `/restore/:id`)
 * — untouched, so mobile is unaffected.
 */
const router = express.Router();
const auth = authMiddleware(role.company);

router.get("/", auth, invoiceController.getAll);
router.post("/", auth, invoiceController.create);
router.get("/:id", auth, invoiceController.getSingle);
router.put("/:id", auth, invoiceController.update);
router.patch("/:id", auth, invoiceController.update);
router.delete("/:id", auth, invoiceController.remove);

export const invoiceRestRoutes = router;
