import mongoose, { Schema, Document, Model } from "mongoose";

import {
  FONT,
  FONT_SIZE,
  FULL_PAGE,
  LINES,
  SCALING,
  ALIGNMENT_H,
  ALIGNMENT_V,
  OUTER_BORDER,
  VARIANT_SIZE,
  VARIANT_TYPE,
  QUANTITY,
  TAX_DISPLAY,
  LINE_ITEM_TAX_FORMAT,
  ITEM_DISPLAY_ORDER,
  NOTES_STYLE,
  SHOW_PRICE_WITH_TAX,
  TITLE_ALIGNMENT,
  SUB_TITLE_ALIGNMENT,
  LOGO_SIZE,
  DATE_FORMAT,
  QR_CODE_ALIGNMENT,
  REG_TAX_ALIGN,
  EMAIL_BELOW,
  MOBILE_BELOW,
  ADDRESS_ALIGNMENT,
  COMPANY_SIGN,
  SIGNATURE_ALIGNMENT,
  SIGNATURE_SIZE,
  SHOW_TEMPLATE_FOR_PAGES,
  PAGE_NUMBER_ALIGNMENT,
  NOTES_FONT_SIZE,
} from "./pdfsettingconstan";
import { TPDFSetting } from "./pdf.setting.interface";

// ─── Helper: object values ───────────────────────────
const vals = <T extends Record<string, string>>(obj: T) =>
  Object.values(obj) as string[];

// ─── Sub-schema: margin ──────────────────────────────────────────────────────
const MarginSchema = new Schema(
  {
    top: { type: Number, default: 10 },
    right: { type: Number, default: 10 },
    bottom: { type: Number, default: 10 },
    left: { type: Number, default: 10 },
  },
  { _id: false },
);

// ─── Sub-schema: style ───────────────────────────────────────────────────────
const StyleSchema = new Schema(
  {
    text_color: { type: String, default: "#000000" },
    fill_color: { type: String, default: "#ffffff" },
    border_color: { type: String, default: "#cccccc" },
    fill_text_color: { type: String, default: "#000000" },
    font: { type: String, enum: vals(FONT), default: FONT.arial },
    font_size: {
      type: String,
      enum: vals(FONT_SIZE),
      default: FONT_SIZE.normal,
    },
    full_page: { type: String, enum: vals(FULL_PAGE), default: FULL_PAGE.no },
    horizontal_lines: { type: String, enum: vals(LINES), default: LINES.show },
    vertical_lines: { type: String, enum: vals(LINES), default: LINES.show },
    scaling: {
      type: String,
      enum: vals(SCALING),
      default: SCALING.fit_to_page,
    },
    horizontal_alignment: {
      type: String,
      enum: vals(ALIGNMENT_H),
      default: ALIGNMENT_H.left,
    },
    vertical_alignment: {
      type: String,
      enum: vals(ALIGNMENT_V),
      default: ALIGNMENT_V.top,
    },
    margin: { type: MarginSchema, default: () => ({}) },
    outer_border: {
      type: String,
      enum: vals(OUTER_BORDER),
      default: OUTER_BORDER.show,
    },
  },
  { _id: false },
);

// ─── Sub-schema: columns ─────────────────────────────────────────────────────
const ColumnsSchema = new Schema(
  {
    serial: { type: Boolean, default: true },
    line_item_image: { type: Boolean, default: false },
    variant_size: {
      type: String,
      enum: vals(VARIANT_SIZE),
      default: VARIANT_SIZE.with_product,
    },
    variant_type: {
      type: String,
      enum: vals(VARIANT_TYPE),
      default: VARIANT_TYPE.with_product,
    },
    sku: { type: Boolean, default: false },
    sac: { type: Boolean, default: false },
    hsn: { type: Boolean, default: false },
    quntity: {
      type: String,
      enum: vals(QUANTITY),
      default: QUANTITY.show_for_both,
    },
    price: { type: Boolean, default: true },
    discount: { type: Boolean, default: false },
    tax: {
      type: String,
      enum: vals(TAX_DISPLAY),
      default: TAX_DISPLAY.individual,
    },
    line_item_tax_format: {
      type: String,
      enum: vals(LINE_ITEM_TAX_FORMAT),
      default: LINE_ITEM_TAX_FORMAT.show_as_percentage,
    },
    item_display_order: {
      type: String,
      enum: vals(ITEM_DISPLAY_ORDER),
      default: ITEM_DISPLAY_ORDER.combined,
    },
    notes: {
      type: String,
      enum: vals(NOTES_STYLE),
      default: NOTES_STYLE.light,
    },
    line_total: { type: Boolean, default: true },
    show_price_with_tax: {
      type: String,
      enum: vals(SHOW_PRICE_WITH_TAX),
      default: SHOW_PRICE_WITH_TAX.default,
    },
    line_description_full_with: { type: Boolean, default: false },
  },
  { _id: false },
);

// ─── Sub-schema: header ──────────────────────────────────────────────────────
const HeaderSchema = new Schema(
  {
    title_alignment: {
      type: String,
      enum: vals(TITLE_ALIGNMENT),
      default: TITLE_ALIGNMENT.center,
    },
    sub_title_alignment: {
      type: String,
      enum: vals(SUB_TITLE_ALIGNMENT),
      default: SUB_TITLE_ALIGNMENT.left,
    },
    sub_title: { type: Boolean, default: true },
    logo_size: {
      type: String,
      enum: vals(LOGO_SIZE),
      default: LOGO_SIZE.medium,
    },
    date_format: {
      type: String,
      enum: vals(DATE_FORMAT),
      default: DATE_FORMAT.medium,
    },
    logo: { type: Boolean, default: true },
    header: { type: Boolean, default: true },
    status_watermark: { type: Boolean, default: false },
    number: { type: Boolean, default: true },
    po_no: { type: Boolean, default: false },
    due_date: { type: Boolean, default: true },
    total_outstanding: { type: Boolean, default: false },
    paid_amount: { type: Boolean, default: false },
    qr_code: { type: Boolean, default: false },
    qr_code_alignment: {
      type: String,
      enum: vals(QR_CODE_ALIGNMENT),
      default: QR_CODE_ALIGNMENT.left,
    },
    document_copy_label: { type: Boolean, default: false },
    total_amount: { type: Boolean, default: true },
    ganarated_by: { type: Boolean, default: false },
    supply_type: { type: Boolean, default: false },
    ganarated_date: { type: Boolean, default: false },
    cancelled_date: { type: Boolean, default: false },
    valid_till: { type: Boolean, default: false },
  },
  { _id: false },
);

// ─── Sub-schema: company ─────────────────────────────────────────────────────
const CompanySchema = new Schema(
  {
    Reg_no: { type: Boolean, default: true },
    reg_no_tax_id_align_below: {
      type: String,
      enum: vals(REG_TAX_ALIGN),
      default: REG_TAX_ALIGN.name,
    },
    tax_id: { type: Boolean, default: true },
    name: { type: Boolean, default: true },
    country: { type: Boolean, default: true },
    address: { type: Boolean, default: true },
    phone: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    fax: { type: Boolean, default: false },
    email: { type: Boolean, default: true },
    website: { type: Boolean, default: false },
  },
  { _id: false },
);

// ─── Sub-schema: contact ─────────────────────────────────────────────────────
const ContactSchema = new Schema(
  {
    tax_id: { type: Boolean, default: true },
    reg_no: { type: Boolean, default: false },
    reg_no_tax_id_align_below: {
      type: String,
      enum: vals(REG_TAX_ALIGN),
      default: REG_TAX_ALIGN.name,
    },
    home_phone: { type: Boolean, default: false },
    business_phone: { type: Boolean, default: false },
    email: { type: Boolean, default: true },
    email_below_contact: {
      type: String,
      enum: vals(EMAIL_BELOW),
      default: EMAIL_BELOW.name,
    },
    mobaile: { type: Boolean, default: false },
    fax: { type: Boolean, default: false },
    first_last_name: { type: Boolean, default: true },
    mobile_below_contact: {
      type: String,
      enum: vals(MOBILE_BELOW),
      default: MOBILE_BELOW.name,
    },
    address_alignment: {
      type: String,
      enum: vals(ADDRESS_ALIGNMENT),
      default: ADDRESS_ALIGNMENT.left,
    },
    billing_adreess_alignment: {
      type: String,
      enum: vals(ADDRESS_ALIGNMENT),
      default: ADDRESS_ALIGNMENT.left,
    },
    shipping_adreess_alignment: {
      type: String,
      enum: vals(ADDRESS_ALIGNMENT),
      default: ADDRESS_ALIGNMENT.left,
    },
  },
  { _id: false },
);

// ─── Sub-schema: summary ─────────────────────────────────────────────────────
const SummarySchema = new Schema(
  {
    total_quantity: {
      single_total: { type: Boolean, default: true },
      group_by_unit: { type: Boolean, default: false },
      _id: false,
    },
    include_items_from: {
      products: { type: Boolean, default: true },
      tasks: { type: Boolean, default: true },
      _id: false,
    },
    amount_unused: { type: Boolean, default: false },
    sub_total: { type: Boolean, default: true },
    discount: { type: Boolean, default: false },
    inline_discount: { type: Boolean, default: false },
    shipping_cost: { type: Boolean, default: false },
    shipping_method: { type: Boolean, default: false },
    total: { type: Boolean, default: true },
    amount_due: { type: Boolean, default: true },
    amount_paid: { type: Boolean, default: false },
    amount_used: { type: Boolean, default: false },
    tax: {
      type: String,
      enum: vals(TAX_DISPLAY),
      default: TAX_DISPLAY.combine,
    },
    tax_value: { type: Boolean, default: true },
    taxable_amount: { type: Boolean, default: false },
    tatal_in_words: { type: Boolean, default: false },
    hsc_sac_summary: { type: Boolean, default: false },
    return_order: { type: Boolean, default: false },
  },
  { _id: false },
);

// ─── Sub-schema: notes_terms ─────────────────────────────────────────────────
const NotesTermsSchema = new Schema(
  {
    notes: { type: Boolean, default: true },
    notes_title: { type: Boolean, default: true },
    font_size: {
      type: String,
      enum: vals(NOTES_FONT_SIZE),
      default: NOTES_FONT_SIZE.medium,
    },
    bank_details: { type: Boolean, default: false },
    bank_details_title: { type: Boolean, default: true },
    full_with: { type: Boolean, default: false },
    terms_and_condition: { type: Boolean, default: true },
  },
  { _id: false },
);

// ─── Sub-schema: signature ───────────────────────────────────────────────────
const SignatureSchema = new Schema(
  {
    company_sign: {
      type: String,
      enum: vals(COMPANY_SIGN),
      default: COMPANY_SIGN.hide,
    },
    contact_sign: { type: Boolean, default: false },
    company_signature_alignment: {
      type: String,
      enum: vals(SIGNATURE_ALIGNMENT),
      default: SIGNATURE_ALIGNMENT.center,
    },
    contact_signature_alignment: {
      type: String,
      enum: vals(SIGNATURE_ALIGNMENT),
      default: SIGNATURE_ALIGNMENT.center,
    },
    signature_size: {
      type: String,
      enum: vals(SIGNATURE_SIZE),
      default: SIGNATURE_SIZE.medium,
    },
  },
  { _id: false },
);

// ─── Sub-schema: footer ──────────────────────────────────────────────────────
const FooterSchema = new Schema(
  {
    created_moon_invoice_hyperlink: { type: Boolean, default: true },
    show_tamplate_for_pages: {
      type: String,
      enum: vals(SHOW_TEMPLATE_FOR_PAGES),
      default: SHOW_TEMPLATE_FOR_PAGES.all,
    },
    page_number_alignment: {
      type: String,
      enum: vals(PAGE_NUMBER_ALIGNMENT),
      default: PAGE_NUMBER_ALIGNMENT.center,
    },
  },
  { _id: false },
);

// ─── Main Schema ─────────────────────────────────────────────────────────────

export interface IPDFSetting extends TPDFSetting, Document {
  createdAt: Date;
  updatedAt: Date;
}

export const documentTypes = [
  "Invoice",
  "Sales_Receipt",
  "Proforma_Invoice",
  "Estimate",
  "Delivery_Challan",
  "Bill",
  "Purchase_Order",
  "Credit_Note",
  "Payment_Received",
  "Payment_Made",
  "Debit_Note",
  "Statement",
  "Packing_Slip",
  "Delivery_Note",
];
const PDFSettingSchema = new Schema<IPDFSetting>(
  {
    pdfType: {
      type: String,
      required: true,
      enum: documentTypes,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref  : "User"
    },

    style: { type: StyleSchema, default: () => ({}) },
    columns: { type: ColumnsSchema, default: () => ({}) },
    header: { type: HeaderSchema, default: () => ({}) },
    company: { type: CompanySchema, default: () => ({}) },
    contact: { type: ContactSchema, default: () => ({}) },
    summary: { type: SummarySchema, default: () => ({}) },
    notes_terms: { type: NotesTermsSchema, default: () => ({}) },
    signature: { type: SignatureSchema, default: () => ({}) },
    footer: { type: FooterSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const PDFSettingModel: Model<IPDFSetting> =
  mongoose.models.PDFSetting ||
  mongoose.model<IPDFSetting>("PDFSetting", PDFSettingSchema);
