/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import AppError from "../../../errors/AppError";
import { IUser } from "../../basic_modules/user/user.interface";
import { PaymentModel } from "../addPayment/payment.model";
import { PaymentReceivedModel } from "../paymentReceived/paymentReceived.model";
import { CompanyRegisterModel } from "../companyRegister/companyRegister.model";
import { SignatureModel } from "../setting/signature/signature.model";

export type WebPaymentReference = { id: string; source: "received" | "direct" };

const text = (value: any) => value == null ? "" : String(value).trim();
const address = (value: any): string => {
  if (typeof value === "string") return value;
  if (!value) return "";
  return [value.street, value.street2, value.city, value.state, value.zip, value.country]
    .map(text).filter(Boolean).join(", ");
};
const addressLines = (value: any): string[] => {
  if (typeof value === "string") return value.split(/\r?\n/).map(text).filter(Boolean);
  if (!value) return [];
  return [value.street, value.street2, value.city, value.state, value.zip, value.country]
    .map(text).filter(Boolean);
};

/** Read-only resolver for the website. Legacy mobile PDF resolvers stay intact. */
export async function resolveWebPaymentReceipt(user: IUser, reference?: WebPaymentReference) {
  const [owner, signature] = await Promise.all([
    CompanyRegisterModel.findOne({ user_id: user._id, is_owner: true, isDeleted: { $ne: true } }).lean(),
    SignatureModel.findOne({ user_id: user._id, isDeleted: false }).sort({ createdAt: -1 }).lean(),
  ]);
  const profile: any = (user as any).businessProfile || {};
  const company = {
    name: text(owner?.business_name || profile.companyName || user.name),
    address: address(owner?.billing_address || profile.billing_address || (user as any).address),
    country: text(profile.billing_address?.country || (user as any).country),
    email: text(owner?.email || user.email),
    phone: text(owner?.phone || user.phone),
    mobile: text(owner?.mobile || user.phone),
    fax: text(owner?.fax || profile.fax),
    website: text(owner?.website || profile.website),
    regNo: text(owner?.reg_no || profile.reg_no),
    taxId: text(owner?.vat || profile.tax_number),
    // An explicitly removed company logo must not become the user's avatar.
    logo: text(owner ? owner.logo : profile.logo || (user as any).image),
    signature: text(signature?.image || (user as any).signature),
  };
  if (!reference) return {
    company, customer: { name: "Customer" }, number: "Sample", invoiceNumber: "",
    date: null, amount: 0, currency: "USD", method: "", notes: "", terms: "", sample: true,
  };
  if (!Types.ObjectId.isValid(reference.id) || !["received", "direct"].includes(reference.source)) {
    throw new AppError(400, "Invalid payment reference");
  }
  const scope = { _id: reference.id, user_id: user._id, isDeleted: { $ne: true } };
  const query = reference.source === "direct" ? PaymentModel.findOne(scope) : PaymentReceivedModel.findOne(scope);
  const payment: any = await query.populate("customer_id").populate("invoice_id").lean();
  if (!payment) throw new AppError(404, "Payment not found");
  const contact = payment.customer_id || {};
  const bp = contact.businessProfile || {};
  const invoice = payment.invoice_id || {};
  const amount = Number(reference.source === "direct" ? payment.amount : payment.total);
  if (!Number.isFinite(amount) || amount < 0) throw new AppError(422, "Payment amount is invalid");
  return {
    company,
    customer: {
      name: text(contact.name || payment.customer_name || bp.companyName),
      companyName: text(bp.companyName),
      email: text(contact.email), phone: text(contact.phone),
      businessPhone: text(bp.phone), fax: text(bp.fax),
      address: address(payment.billing_address || bp.billing_address),
      addressLines: addressLines(payment.billing_address || bp.billing_address),
      regNo: text(bp.reg_no), taxId: text(bp.tax_number),
    },
    number: text(payment.payment_number) || `PR-${String(payment._id).slice(-8).toUpperCase()}`,
    invoiceNumber: text(invoice.invoice_number || payment.invoice_number),
    date: reference.source === "direct" ? payment.payment_date : payment.date || payment.createdAt,
    amount, currency: text(payment.currency || invoice.currency || (user as any).currency) || "USD",
    method: reference.source === "direct" ? text(payment.payment_type) : (payment.payment_method || []).join(", "),
    notes: text(payment.notes), terms: text(payment.terms_and_conditions), sample: false,
  };
}
