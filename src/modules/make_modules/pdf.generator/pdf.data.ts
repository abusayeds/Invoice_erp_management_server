/* eslint-disable @typescript-eslint/no-explicit-any */
// Resolves real document data into the shape the PDF generators expect.
// Missing fields fall back to "N/A"; when no id is given (or the doc is not
// found) a blank skeleton is returned so a valid PDF is still produced.
//
// All "sales document" types share the same invoice-style schema
// (product[]/service[]/addresses/totals + a customer or vendor party), so one
// generic resolver + the invoice generator render them all.
import { InvoiceModel } from "../invoice/invoice.model";
import { SalesReceiptModel } from "../salesReceipt/salesReceipt.model";
import { ProformaInvoiceModel } from "../proformaInvoice/proformaInvoice.model";
import { EstimateModel } from "../estimate/estimate.model";
import { DeliveryChallanModel } from "../deliveryChallan/deliveryChallan.model";
import { BillModel } from "../bill/bill.model";
import { CreditNoteModel } from "../creditNote/creditNote.model";
import { DebitNoteModel } from "../debitNote/debitNote.model";
import { ExpensesModel } from "../expenses/expenses.model";
import { PurchaseInvoiceModel } from "../purchase/purchaseInvoice/purchaseInvoice.model";

export const NA = "N/A";

type DocConfig = { model: any; party: "customer_id" | "vendor_id"; title: string; billLabel: string };

// type → which model / party / header title / "… To:" label
// NOTE: Payment receipt uses PaymentModel via payment.receipt.data.ts (not invoice-style).
const DOC_CONFIG: Record<string, DocConfig> = {
  Invoice:          { model: InvoiceModel,         party: "customer_id", title: "INVOICE",          billLabel: "Invoice To:" },
  Sales_Receipt:    { model: SalesReceiptModel,    party: "customer_id", title: "SALES RECEIPT",    billLabel: "Receipt To:" },
  Proforma_Invoice: { model: ProformaInvoiceModel, party: "customer_id", title: "PROFORMA INVOICE", billLabel: "Invoice To:" },
  Estimate:         { model: EstimateModel,        party: "customer_id", title: "ESTIMATE",         billLabel: "Estimate To:" },
  Delivery_Challan: { model: DeliveryChallanModel, party: "customer_id", title: "DELIVERY CHALLAN", billLabel: "Deliver To:" },
  Bill:             { model: BillModel,            party: "vendor_id",   title: "BILL",             billLabel: "Bill From:" },
  Credit_Note:      { model: CreditNoteModel,      party: "customer_id", title: "CREDIT NOTE",      billLabel: "Credit To:" },
  Debit_Note:       { model: DebitNoteModel,       party: "vendor_id",   title: "DEBIT NOTE",       billLabel: "Debit To:" },
  Expense:          { model: ExpensesModel,        party: "vendor_id",   title: "EXPENSE",          billLabel: "Expense To:" },
  Purchase_Order:   { model: PurchaseInvoiceModel, party: "vendor_id",   title: "PURCHASE ORDER",   billLabel: "Order To:" },
};

export const isSalesDoc = (type: string): boolean => Boolean(DOC_CONFIG[type]);

export const getDocConfig = (type: string) => DOC_CONFIG[type] || null;

// Invoice-style types wired to live data (derived from the config — no hardcoding).
export const getSalesDocTypes = () =>
  Object.entries(DOC_CONFIG).map(([type, cfg]) => ({
    type,
    title: cfg.title,
    dataSource: "live" as const,
  }));

const txt = (v: any): string => (v === undefined || v === null || v === "" ? NA : String(v));
const num = (v: any): number => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const money = (v: any, currency: string): string => {
  const n = Number(v);
  return Number.isFinite(n) ? `${currency} ${n.toFixed(2)}`.trim() : NA;
};
const qty = (v: any): string => { const n = Number(v); return Number.isFinite(n) ? n.toFixed(3) : NA; };
const fmtDate = (d: any): string => {
  if (!d) return NA;
  const date = new Date(d);
  return isNaN(date.getTime()) ? NA : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

// addressSchema → "street\nstreet2\ncity, state zip\ncountry"
const docAddress = (a: any): string => {
  if (!a) return NA;
  const cityLine = [a.city, a.state].filter(Boolean).join(", ");
  const lines = [a.street, a.street2, [cityLine, a.zip].filter(Boolean).join(" "), a.country]
    .map((l) => (l || "").trim()).filter(Boolean);
  return lines.length ? lines.join("\n") : NA;
};

// businessProfile address {address_line_1, address_line_2, city, state, country, zip_code}
const bpAddress = (a: any): string => {
  if (!a) return NA;
  const cityLine = [a.city, a.state].filter(Boolean).join(", ");
  const lines = [a.address_line_1, a.address_line_2, [cityLine, a.zip_code].filter(Boolean).join(" "), a.country]
    .map((l) => (l || "").trim()).filter(Boolean);
  return lines.length ? lines.join("\n") : NA;
};

// Sender company = the logged-in company user.
const buildCompany = (user: any) => {
  const bp = user?.businessProfile || {};
  const addr = bpAddress(bp.billing_address);
  return {
    name: txt(bp.companyName || user?.name),
    regNo: txt(bp.reg_no),
    taxId: txt(bp.tax_number),
    address: addr !== NA ? addr : txt(user?.address),
    phone: txt(user?.phone),
    mobile: txt(user?.phone),
    fax: txt(bp.fax),
    email: txt(user?.email),
    website: txt(bp.website),
  };
};

const emptyContact = () => ({
  name: NA, email: NA, phone: NA, businessPhone: NA, poBox: NA,
  taxId: NA, regNo: NA, contactTaxId: NA, address: NA,
});

const buildSample = (company: any, cfg: DocConfig) => ({
  docTitle: cfg.title,
  billLabel: cfg.billLabel,
  invoiceNumber: NA, poNumber: NA, date: NA, dueDate: NA, total: NA, outstanding: NA,
  company,
  billTo: emptyContact(),
  shipTo: { address: NA, shippingMethod: NA },
  products: [] as any[],
  services: [] as any[],
  summary: { subTotal: 0, discount: 0, inlineDiscount: 0, shippingCost: 0, gst9on5: 0, total: 0, amountPaid: 0, returnOrder: 0, amountDue: 0 },
  termsAndConditions: NA,
  notes: NA,
  hsnSacSummary: [] as any[],
  signature: { companyName: company.name, subtitle: "Authorized Signatory" },
  qrCodeData: NA,
  paymentDetails: [] as any[],
});

/** Generic resolver for every invoice-style document. */
export const resolveSalesDoc = async (type: string, id: string | undefined, user: any) => {
  const cfg = DOC_CONFIG[type];
  if (!cfg) return null;
  const company = buildCompany(user);
  if (!id) return buildSample(company, cfg);

  const inv: any = await cfg.model
    .findOne({ _id: id, user_id: user?._id, isDeleted: false })
    .populate(cfg.party)
    .populate("product.product_id")
    .populate("service.service_id")
    .lean()
    .catch(() => null);

  if (!inv) return buildSample(company, cfg);

  const cur = inv.currency || "USD";
  const c = inv[cfg.party] || {};
  const cbp = c.businessProfile || {};

  const billTo = {
    name: txt(cbp.companyName || c.name),
    email: txt(c.email),
    phone: txt(c.phone),
    businessPhone: txt(c.phone),
    poBox: NA,
    taxId: txt(cbp.tax_number),
    regNo: txt(cbp.reg_no),
    contactTaxId: txt(cbp.tax_number),
    address: docAddress(inv.billing_address) !== NA ? docAddress(inv.billing_address) : bpAddress(cbp.billing_address),
  };

  const products = (inv.product || []).map((p: any, i: number) => {
    const prod = p.product_id || {};
    return {
      srNo: i + 1,
      name: txt(prod.productName),
      description: prod.description || "",
      hsn: txt(prod.sku),
      quantity: qty(p.quantity),
      unitPrice: money(p.rate, cur),
      discount: money(p.discount, cur),
      gst: money(p.tax, cur),
      amount: money(p.amount, cur),
    };
  });

  const services = (inv.service || []).map((sv: any, i: number) => {
    const srv = sv.service_id || {};
    return {
      srNo: i + 1,
      name: txt(srv.serviceName),
      description: srv.description || "",
      sac: NA,
      quantity: qty(sv.quantity),
      rate: money(sv.rate, cur),
      discount: money(sv.discount, cur),
      gst: money(sv.tax, cur),
      amount: money(sv.amount, cur),
    };
  });

  return {
    docTitle: cfg.title,
    billLabel: cfg.billLabel,
    invoiceNumber: txt(inv.invoice_number),
    poNumber: txt(inv.po),
    date: fmtDate(inv.date),
    dueDate: fmtDate(inv.due_date),
    total: money(inv.total, cur),
    outstanding: money(inv.balance_amount ?? inv.total, cur),
    company,
    billTo,
    shipTo: { address: docAddress(inv.shipping_address), shippingMethod: txt(inv.shipping_method) },
    products,
    services,
    summary: {
      subTotal: num(inv.sub_total),
      discount: num(inv.discount),
      inlineDiscount: num(inv.inline_discount),
      shippingCost: num(inv.shipping_cost),
      gst9on5: num(inv.tax),
      total: num(inv.total),
      amountPaid: num(inv.paid_amount),
      returnOrder: 0,
      amountDue: num(inv.balance_amount ?? inv.total),
    },
    termsAndConditions: txt(inv.terms_and_conditions),
    notes: txt(inv.notes),
    hsnSacSummary: [],
    signature: { companyName: company.name, subtitle: "Authorized Signatory" },
    qrCodeData: `${process.env.CLIENT_URL || "https://app.mooninvoice.com"}/${type}/${inv._id}`,
    paymentDetails: [],
  };
};

// Back-compat alias.
export const resolveInvoiceData = (id: string | undefined, user: any) => resolveSalesDoc("Invoice", id, user);
