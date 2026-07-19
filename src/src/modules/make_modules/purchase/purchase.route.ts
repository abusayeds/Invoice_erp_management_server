import express from "express";
import { purchaseInvoiceRoutes } from "./purchaseInvoice/purchaseInvoice.route";
import { purchaseReturnRoutes } from "./purchaseReturn/purchaseReturn.route";
import { warehouseRoutes } from "./warehouse/warehouse.route";

const router = express.Router();

// Mirrors the Laravel Purchase section: Purchase Invoices, Purchase Returns, Warehouses.
router.use("/invoices", purchaseInvoiceRoutes);
router.use("/returns", purchaseReturnRoutes);
router.use("/warehouses", warehouseRoutes);

export const purchaseRoutes = router;
