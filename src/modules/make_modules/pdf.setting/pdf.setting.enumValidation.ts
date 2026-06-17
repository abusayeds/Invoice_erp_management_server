import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import {
  FONT, FONT_SIZE, FULL_PAGE, LINES, SCALING, ALIGNMENT_H, ALIGNMENT_V, OUTER_BORDER,
  VARIANT_SIZE, VARIANT_TYPE, QUANTITY, TAX_DISPLAY, LINE_ITEM_TAX_FORMAT, ITEM_DISPLAY_ORDER,
  NOTES_STYLE, SHOW_PRICE_WITH_TAX, TITLE_ALIGNMENT, SUB_TITLE_ALIGNMENT, LOGO_SIZE, DATE_FORMAT,
  QR_CODE_ALIGNMENT, REG_TAX_ALIGN, EMAIL_BELOW, MOBILE_BELOW, ADDRESS_ALIGNMENT, COMPANY_SIGN,
  SIGNATURE_ALIGNMENT, SIGNATURE_SIZE, SHOW_TEMPLATE_FOR_PAGES, PAGE_NUMBER_ALIGNMENT, NOTES_FONT_SIZE,
} from "./pdfsettingconstan";

const vals = (obj: Record<string, string>) => Object.values(obj);

// dot-path → allowed enum values. Only the fields that are enums (the rest are boolean/number/color).
const ENUM_VALUES: Record<string, string[]> = {
  "style.font": vals(FONT),
  "style.font_size": vals(FONT_SIZE),
  "style.full_page": vals(FULL_PAGE),
  "style.horizontal_lines": vals(LINES),
  "style.vertical_lines": vals(LINES),
  "style.scaling": vals(SCALING),
  "style.horizontal_alignment": vals(ALIGNMENT_H),
  "style.vertical_alignment": vals(ALIGNMENT_V),
  "style.outer_border": vals(OUTER_BORDER),

  "columns.variant_size": vals(VARIANT_SIZE),
  "columns.variant_type": vals(VARIANT_TYPE),
  "columns.quntity": vals(QUANTITY),
  "columns.tax": vals(TAX_DISPLAY),
  "columns.line_item_tax_format": vals(LINE_ITEM_TAX_FORMAT),
  "columns.item_display_order": vals(ITEM_DISPLAY_ORDER),
  "columns.notes": vals(NOTES_STYLE),
  "columns.show_price_with_tax": vals(SHOW_PRICE_WITH_TAX),

  "header.title_alignment": vals(TITLE_ALIGNMENT),
  "header.sub_title_alignment": vals(SUB_TITLE_ALIGNMENT),
  "header.logo_size": vals(LOGO_SIZE),
  "header.date_format": vals(DATE_FORMAT),
  "header.qr_code_alignment": vals(QR_CODE_ALIGNMENT),

  "company.reg_no_tax_id_align_below": vals(REG_TAX_ALIGN),

  "contact.reg_no_tax_id_align_below": vals(REG_TAX_ALIGN),
  "contact.email_below_contact": vals(EMAIL_BELOW),
  "contact.mobile_below_contact": vals(MOBILE_BELOW),
  "contact.address_alignment": vals(ADDRESS_ALIGNMENT),
  "contact.billing_adreess_alignment": vals(ADDRESS_ALIGNMENT),
  "contact.shipping_adreess_alignment": vals(ADDRESS_ALIGNMENT),

  "summary.tax": vals(TAX_DISPLAY),

  "notes_terms.font_size": vals(NOTES_FONT_SIZE),

  "signature.company_sign": vals(COMPANY_SIGN),
  "signature.company_signature_alignment": vals(SIGNATURE_ALIGNMENT),
  "signature.contact_signature_alignment": vals(SIGNATURE_ALIGNMENT),
  "signature.signature_size": vals(SIGNATURE_SIZE),

  "footer.show_tamplate_for_pages": vals(SHOW_TEMPLATE_FOR_PAGES),
  "footer.page_number_alignment": vals(PAGE_NUMBER_ALIGNMENT),
};

// Flatten a payload (supports both nested objects and dot-notation keys) into dot-paths.
const flatten = (obj: Record<string, unknown>, prefix: string, out: Record<string, unknown>) => {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flatten(v as Record<string, unknown>, path, out);
    } else {
      out[path] = v;
    }
  }
};

/**
 * Validate any enum fields in the payload up-front and throw a clear error that
 * lists the allowed values (instead of Mongoose's generic enum message).
 */
export const validatePdfSettingEnums = (payload: Record<string, unknown>) => {
  const flat: Record<string, unknown> = {};
  flatten(payload || {}, "", flat);

  for (const [path, value] of Object.entries(flat)) {
    if (value === undefined || value === null || value === "") continue;
    const allowed = ENUM_VALUES[path];
    if (allowed && !allowed.includes(String(value))) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid value "${value}" for "${path}". Allowed: ${allowed.join(", ")}`
      );
    }
  }
};
