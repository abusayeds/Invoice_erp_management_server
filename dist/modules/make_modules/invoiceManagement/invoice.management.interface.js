"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceStatus = exports.InvoiceManagementType = void 0;
var InvoiceManagementType;
(function (InvoiceManagementType) {
    InvoiceManagementType["Invoice"] = "Invoice";
    InvoiceManagementType["Sales_Receipt"] = "Sales_Receipt";
    InvoiceManagementType["Proforma_Invoice"] = "Proforma_Invoice";
    InvoiceManagementType["Estimate"] = "Estimate";
    InvoiceManagementType["Delivery_Challan"] = "Delivery_Challan";
    InvoiceManagementType["Credit_Note"] = "Credit_Note";
    InvoiceManagementType["Payment_Received"] = "Payment_Received";
    InvoiceManagementType["Purchase_Order"] = "Purchase_Order";
    InvoiceManagementType["Bill"] = "Bill";
    InvoiceManagementType["Expenses"] = "Expenses";
    InvoiceManagementType["Debit_Note"] = "Debit_Note";
})(InvoiceManagementType || (exports.InvoiceManagementType = InvoiceManagementType = {}));
exports.invoiceStatus = ["Draft", "Partial", "Paid", "Overdue", "Recurring", "Void", "CreditNotesApplied", "Open"];
