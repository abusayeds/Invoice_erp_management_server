"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFSettingModel = exports.documentTypes = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const pdfsettingconstan_1 = require("./pdfsettingconstan");
// ─── Helper: object values ───────────────────────────
const vals = (obj) => Object.values(obj);
// ─── Sub-schema: margin ──────────────────────────────────────────────────────
const MarginSchema = new mongoose_1.Schema({
    top: { type: Number, default: 10 },
    right: { type: Number, default: 10 },
    bottom: { type: Number, default: 10 },
    left: { type: Number, default: 10 },
}, { _id: false });
// ─── Sub-schema: style ───────────────────────────────────────────────────────
const StyleSchema = new mongoose_1.Schema({
    text_color: { type: String, default: "#000000" },
    fill_color: { type: String, default: "#ffffff" },
    border_color: { type: String, default: "#cccccc" },
    fill_text_color: { type: String, default: "#000000" },
    font: { type: String, enum: vals(pdfsettingconstan_1.FONT), default: pdfsettingconstan_1.FONT.arial },
    font_size: {
        type: String,
        enum: vals(pdfsettingconstan_1.FONT_SIZE),
        default: pdfsettingconstan_1.FONT_SIZE.normal,
    },
    full_page: { type: String, enum: vals(pdfsettingconstan_1.FULL_PAGE), default: pdfsettingconstan_1.FULL_PAGE.no },
    horizontal_lines: { type: String, enum: vals(pdfsettingconstan_1.LINES), default: pdfsettingconstan_1.LINES.show },
    vertical_lines: { type: String, enum: vals(pdfsettingconstan_1.LINES), default: pdfsettingconstan_1.LINES.show },
    scaling: {
        type: String,
        enum: vals(pdfsettingconstan_1.SCALING),
        default: pdfsettingconstan_1.SCALING.fit_to_page,
    },
    horizontal_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.ALIGNMENT_H),
        default: pdfsettingconstan_1.ALIGNMENT_H.left,
    },
    vertical_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.ALIGNMENT_V),
        default: pdfsettingconstan_1.ALIGNMENT_V.top,
    },
    margin: { type: MarginSchema, default: () => ({}) },
    outer_border: {
        type: String,
        enum: vals(pdfsettingconstan_1.OUTER_BORDER),
        default: pdfsettingconstan_1.OUTER_BORDER.show,
    },
}, { _id: false });
// ─── Sub-schema: columns ─────────────────────────────────────────────────────
const ColumnsSchema = new mongoose_1.Schema({
    serial: { type: Boolean, default: true },
    line_item_image: { type: Boolean, default: false },
    variant_size: {
        type: String,
        enum: vals(pdfsettingconstan_1.VARIANT_SIZE),
        default: pdfsettingconstan_1.VARIANT_SIZE.with_product,
    },
    variant_type: {
        type: String,
        enum: vals(pdfsettingconstan_1.VARIANT_TYPE),
        default: pdfsettingconstan_1.VARIANT_TYPE.with_product,
    },
    sku: { type: Boolean, default: false },
    sac: { type: Boolean, default: false },
    hsn: { type: Boolean, default: false },
    quntity: {
        type: String,
        enum: vals(pdfsettingconstan_1.QUANTITY),
        default: pdfsettingconstan_1.QUANTITY.show_for_both,
    },
    price: { type: Boolean, default: true },
    discount: { type: Boolean, default: false },
    tax: {
        type: String,
        enum: vals(pdfsettingconstan_1.TAX_DISPLAY),
        default: pdfsettingconstan_1.TAX_DISPLAY.individual,
    },
    line_item_tax_format: {
        type: String,
        enum: vals(pdfsettingconstan_1.LINE_ITEM_TAX_FORMAT),
        default: pdfsettingconstan_1.LINE_ITEM_TAX_FORMAT.show_as_percentage,
    },
    item_display_order: {
        type: String,
        enum: vals(pdfsettingconstan_1.ITEM_DISPLAY_ORDER),
        default: pdfsettingconstan_1.ITEM_DISPLAY_ORDER.combined,
    },
    notes: {
        type: String,
        enum: vals(pdfsettingconstan_1.NOTES_STYLE),
        default: pdfsettingconstan_1.NOTES_STYLE.light,
    },
    line_total: { type: Boolean, default: true },
    show_price_with_tax: {
        type: String,
        enum: vals(pdfsettingconstan_1.SHOW_PRICE_WITH_TAX),
        default: pdfsettingconstan_1.SHOW_PRICE_WITH_TAX.default,
    },
    line_description_full_with: { type: Boolean, default: false },
}, { _id: false });
// ─── Sub-schema: header ──────────────────────────────────────────────────────
const HeaderSchema = new mongoose_1.Schema({
    title_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.TITLE_ALIGNMENT),
        default: pdfsettingconstan_1.TITLE_ALIGNMENT.center,
    },
    sub_title_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.SUB_TITLE_ALIGNMENT),
        default: pdfsettingconstan_1.SUB_TITLE_ALIGNMENT.left,
    },
    sub_title: { type: Boolean, default: true },
    logo_size: {
        type: String,
        enum: vals(pdfsettingconstan_1.LOGO_SIZE),
        default: pdfsettingconstan_1.LOGO_SIZE.medium,
    },
    date_format: {
        type: String,
        enum: vals(pdfsettingconstan_1.DATE_FORMAT),
        default: pdfsettingconstan_1.DATE_FORMAT.medium,
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
        enum: vals(pdfsettingconstan_1.QR_CODE_ALIGNMENT),
        default: pdfsettingconstan_1.QR_CODE_ALIGNMENT.left,
    },
    document_copy_label: { type: Boolean, default: false },
    total_amount: { type: Boolean, default: true },
    ganarated_by: { type: Boolean, default: false },
    supply_type: { type: Boolean, default: false },
    ganarated_date: { type: Boolean, default: false },
    cancelled_date: { type: Boolean, default: false },
    valid_till: { type: Boolean, default: false },
}, { _id: false });
// ─── Sub-schema: company ─────────────────────────────────────────────────────
const CompanySchema = new mongoose_1.Schema({
    Reg_no: { type: Boolean, default: true },
    reg_no_tax_id_align_below: {
        type: String,
        enum: vals(pdfsettingconstan_1.REG_TAX_ALIGN),
        default: pdfsettingconstan_1.REG_TAX_ALIGN.name,
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
}, { _id: false });
// ─── Sub-schema: contact ─────────────────────────────────────────────────────
const ContactSchema = new mongoose_1.Schema({
    tax_id: { type: Boolean, default: true },
    reg_no: { type: Boolean, default: false },
    reg_no_tax_id_align_below: {
        type: String,
        enum: vals(pdfsettingconstan_1.REG_TAX_ALIGN),
        default: pdfsettingconstan_1.REG_TAX_ALIGN.name,
    },
    home_phone: { type: Boolean, default: false },
    business_phone: { type: Boolean, default: false },
    email: { type: Boolean, default: true },
    email_below_contact: {
        type: String,
        enum: vals(pdfsettingconstan_1.EMAIL_BELOW),
        default: pdfsettingconstan_1.EMAIL_BELOW.name,
    },
    mobaile: { type: Boolean, default: false },
    fax: { type: Boolean, default: false },
    first_last_name: { type: Boolean, default: true },
    mobile_below_contact: {
        type: String,
        enum: vals(pdfsettingconstan_1.MOBILE_BELOW),
        default: pdfsettingconstan_1.MOBILE_BELOW.name,
    },
    address_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.ADDRESS_ALIGNMENT),
        default: pdfsettingconstan_1.ADDRESS_ALIGNMENT.left,
    },
    billing_adreess_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.ADDRESS_ALIGNMENT),
        default: pdfsettingconstan_1.ADDRESS_ALIGNMENT.left,
    },
    shipping_adreess_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.ADDRESS_ALIGNMENT),
        default: pdfsettingconstan_1.ADDRESS_ALIGNMENT.left,
    },
}, { _id: false });
// ─── Sub-schema: summary ─────────────────────────────────────────────────────
const SummarySchema = new mongoose_1.Schema({
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
        enum: vals(pdfsettingconstan_1.TAX_DISPLAY),
        default: pdfsettingconstan_1.TAX_DISPLAY.combine,
    },
    tax_value: { type: Boolean, default: true },
    taxable_amount: { type: Boolean, default: false },
    tatal_in_words: { type: Boolean, default: false },
    hsc_sac_summary: { type: Boolean, default: false },
    return_order: { type: Boolean, default: false },
}, { _id: false });
// ─── Sub-schema: notes_terms ─────────────────────────────────────────────────
const NotesTermsSchema = new mongoose_1.Schema({
    notes: { type: Boolean, default: true },
    notes_title: { type: Boolean, default: true },
    font_size: {
        type: String,
        enum: vals(pdfsettingconstan_1.NOTES_FONT_SIZE),
        default: pdfsettingconstan_1.NOTES_FONT_SIZE.medium,
    },
    bank_details: { type: Boolean, default: false },
    bank_details_title: { type: Boolean, default: true },
    full_with: { type: Boolean, default: false },
    terms_and_condition: { type: Boolean, default: true },
}, { _id: false });
// ─── Sub-schema: signature ───────────────────────────────────────────────────
const SignatureSchema = new mongoose_1.Schema({
    company_sign: {
        type: String,
        enum: vals(pdfsettingconstan_1.COMPANY_SIGN),
        default: pdfsettingconstan_1.COMPANY_SIGN.hide,
    },
    contact_sign: { type: Boolean, default: false },
    company_signature_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.SIGNATURE_ALIGNMENT),
        default: pdfsettingconstan_1.SIGNATURE_ALIGNMENT.center,
    },
    contact_signature_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.SIGNATURE_ALIGNMENT),
        default: pdfsettingconstan_1.SIGNATURE_ALIGNMENT.center,
    },
    signature_size: {
        type: String,
        enum: vals(pdfsettingconstan_1.SIGNATURE_SIZE),
        default: pdfsettingconstan_1.SIGNATURE_SIZE.medium,
    },
}, { _id: false });
// ─── Sub-schema: footer ──────────────────────────────────────────────────────
const FooterSchema = new mongoose_1.Schema({
    created_moon_invoice_hyperlink: { type: Boolean, default: true },
    show_tamplate_for_pages: {
        type: String,
        enum: vals(pdfsettingconstan_1.SHOW_TEMPLATE_FOR_PAGES),
        default: pdfsettingconstan_1.SHOW_TEMPLATE_FOR_PAGES.all,
    },
    page_number_alignment: {
        type: String,
        enum: vals(pdfsettingconstan_1.PAGE_NUMBER_ALIGNMENT),
        default: pdfsettingconstan_1.PAGE_NUMBER_ALIGNMENT.center,
    },
}, { _id: false });
exports.documentTypes = [
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
const PDFSettingSchema = new mongoose_1.Schema({
    pdfType: {
        type: String,
        required: true,
        enum: exports.documentTypes,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
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
}, {
    timestamps: true,
    versionKey: false,
});
exports.PDFSettingModel = mongoose_1.default.models.PDFSetting ||
    mongoose_1.default.model("PDFSetting", PDFSettingSchema);
