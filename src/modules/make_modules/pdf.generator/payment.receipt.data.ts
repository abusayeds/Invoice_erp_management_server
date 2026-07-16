/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentModel } from "../addPayment/payment.model";
import { InvoiceModel } from "../invoice/invoice.model";
import { IUser } from "../../basic_modules/user/user.interface";

const NA = "N/A";
const txt = (v: any): string => (v === undefined || v === null || v === "" ? NA : String(v));
const fmtDate = (d: any): string => {
  if (!d) return NA;
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? NA
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
const fmtMoney = (amount: any, currency?: string): string => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return NA;
  const cur = currency || "";
  return `${n.toFixed(2)}${cur ? ` ${cur}` : ""}`.trim();
};

const bpAddressCountry = (user: any): string => {
  const bp = user?.businessProfile || {};
  return txt(bp.billing_address?.country || user?.country || "");
};

/**
 * Resolve PaymentModel → PAYMENT RECEIPT PDF data shape.
 * Layout matches: title, logo, company, Received From, payment table, signature.
 */
export const resolvePaymentReceiptData = async (id: string | undefined, user: IUser) => {
  const bp = (user as any)?.businessProfile || {};
  const company = {
    name: txt(bp.companyName || user?.name),
    country: bpAddressCountry(user) === NA ? "" : bpAddressCountry(user),
    email: txt(user?.email),
    logo: (user as any)?.image || bp.logo || null,
    signature: (user as any)?.signature || null,
  };

  const empty = {
    title: "PAYMENT RECEIPT",
    company,
    receivedFrom: {
      name: NA,
      companyName: NA,
      email: NA,
      mobile: NA,
      taxId: NA,
      regNo: NA,
      lines: [] as string[],
    },
    payment: {
      paymentNo: NA,
      date: NA,
      amount: NA,
      paymentType: NA,
    },
    signature: {
      image: company.signature,
      companyName: company.name,
    },
  };

  if (!id) return empty;

  const doc: any = await PaymentModel.findOne({
    _id: id,
    user_id: user._id,
    isDeleted: false,
  })
    .populate("customer_id")
    .lean();

  if (!doc) return empty;

  const customer = doc.customer_id || {};
  const cbp = customer.businessProfile || {};
  const receivedFrom = {
    name: txt(customer.name),
    companyName: txt(cbp.companyName),
    email: txt(customer.email),
    mobile: txt(customer.phone),
    taxId: txt(cbp.tax_number),
    regNo: txt(cbp.reg_no),
    lines: [] as string[],
  };

  // Build display lines like the screenshot (skip empty / N/A)
  const lineCandidates = [
    receivedFrom.name,
    receivedFrom.companyName,
    receivedFrom.email,
    receivedFrom.mobile !== NA ? `Mobile: ${receivedFrom.mobile}` : NA,
    receivedFrom.taxId,
    receivedFrom.regNo,
  ];
  receivedFrom.lines = lineCandidates.filter((l) => l && l !== NA);

  let currency = (user as any)?.currency || "";
  if (doc.invoice_id) {
    const inv: any = await InvoiceModel.findById(doc.invoice_id).select("currency invoice_number").lean();
    if (inv?.currency) currency = inv.currency;
  }

  const paymentNo =
    doc.payment_number ||
    (doc._id ? String(doc._id).slice(-8).toUpperCase() : NA);

  return {
    title: "PAYMENT RECEIPT",
    company,
    receivedFrom,
    payment: {
      paymentNo: txt(paymentNo),
      date: fmtDate(doc.payment_date),
      amount: fmtMoney(doc.amount, currency),
      paymentType: txt(doc.payment_type),
    },
    signature: {
      image: company.signature,
      companyName: company.name,
    },
  };
};
