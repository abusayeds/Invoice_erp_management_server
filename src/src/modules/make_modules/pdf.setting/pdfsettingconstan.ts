
type ValueOf<T> = T[keyof T];
export const FONT = {
  arial:               "arial",
  arial_bold:          "arial_bold",
  arial_italic:        "arial_italic",
  arial_bold_italic:   "arial_bold_italic",
  times:               "times",
  times_bold:          "times_bold",
  times_italic:        "times_italic",
  times_bold_italic:   "times_bold_italic",
  courier:             "courier",
  courier_bold:        "courier_bold",
  courier_italic:      "courier_italic",
  courier_bold_italic: "courier_bold_italic",
} as const;

export const FONT_SIZE = {
  small:    "small",
  normal:   "normal",
  large:    "large",
  x_large:  "x-large",
  xx_large: "xx-large",
} as const;

export const FULL_PAGE = { yes: "yes", no: "no" } as const;

export const LINES = { show: "show", hide: "hide" } as const;

export const SCALING = {
  fit_to_page: "fit_to_page",
  actual_size: "actual_size",
} as const;

export const ALIGNMENT_H = {
  left:   "left",
  center: "center",
  right:  "right",
} as const;

export const ALIGNMENT_V = {
  top:    "top",
  middle: "middle",
  bottom: "bottom",
} as const;

export const OUTER_BORDER = { show: "show", hide: "hide" } as const;

export const VARIANT_SIZE = {
  with_product:    "with_product",
  separate_column: "separate_column",
  hide:            "hide",
} as const;

export const VARIANT_TYPE = {
  with_product:    "with_product",
  without_product: "without_product",
  hide:            "hide",
} as const;

export const QUANTITY = {
  hide:             "hide",
  show_for_both:    "show_for_both",
  show_for_product: "show_for_product",
  show_for_service: "show_for_service",
} as const;

export const TAX_DISPLAY = {
  hide:       "hide",
  individual: "individual",
  combine:    "combine",
} as const;

export const LINE_ITEM_TAX_FORMAT = {
  show_as_percentage: "show_as_percentage",
  show_as_amount:     "show_as_amount",
  show_both_values:   "show_both_values",
} as const;

export const ITEM_DISPLAY_ORDER = {
  services_first: "services_first",
  products_first: "products_first",
  combined:       "combined",
} as const;

export const NOTES_STYLE = {
  dark:  "dark",
  light: "light",
  hide:  "hide",
} as const;

export const SHOW_PRICE_WITH_TAX = {
  yes:     "yes",
  no:      "no",
  default: "default",
} as const;

export const TITLE_ALIGNMENT = {
  center: "center",
  right:  "right",
} as const;

export const SUB_TITLE_ALIGNMENT = {
  center: "center",
  right:  "right",
  left:   "left",
} as const;

export const LOGO_SIZE = {
  small:  "small",
  medium: "medium",
  large:  "large",
} as const;

export const DATE_FORMAT = {
  short:  "short",
  medium: "medium",
  long:   "long",
} as const;

export const QR_CODE_ALIGNMENT = {
  left:   "left",
  center: "center",
  right:  "right",
} as const;

export const REG_TAX_ALIGN = { name: "name", address: "address" } as const;

export const EMAIL_BELOW = { name: "name", address: "address" } as const;

export const MOBILE_BELOW = { name: "name", address: "address" } as const;

export const ADDRESS_ALIGNMENT = { left: "left", right: "right" } as const;

export const COMPANY_SIGN = {
  hide:    "hide",
  company: "company",
  user:    "user",
} as const;

export const SIGNATURE_ALIGNMENT = {
  center: "center",
  right:  "right",
  left:   "left",
} as const;

export const SIGNATURE_SIZE = {
  small:  "small",
  medium: "medium",
  large:  "large",
} as const;

export const SHOW_TEMPLATE_FOR_PAGES = {
  first: "first",
  all:   "all",
} as const;

export const PAGE_NUMBER_ALIGNMENT = {
  center: "center",
  right:  "right",
  left:   "left",
} as const;

export const NOTES_FONT_SIZE = {
  small:       "small",
  medium:      "medium",
  large:       "large",
  extra_large: "extra_large",
} as const;


export type TFont                 = ValueOf<typeof FONT>;
export type TFontSize             = ValueOf<typeof FONT_SIZE>;
export type TFullPage             = ValueOf<typeof FULL_PAGE>;
export type TLines                = ValueOf<typeof LINES>;
export type TScaling              = ValueOf<typeof SCALING>;
export type TAlignmentH           = ValueOf<typeof ALIGNMENT_H>;
export type TAlignmentV           = ValueOf<typeof ALIGNMENT_V>;
export type TOuterBorder          = ValueOf<typeof OUTER_BORDER>;
export type TVariantSize          = ValueOf<typeof VARIANT_SIZE>;
export type TVariantType          = ValueOf<typeof VARIANT_TYPE>;
export type TQuantity             = ValueOf<typeof QUANTITY>;
export type TTaxDisplay           = ValueOf<typeof TAX_DISPLAY>;
export type TLineItemTaxFormat    = ValueOf<typeof LINE_ITEM_TAX_FORMAT>;
export type TItemDisplayOrder     = ValueOf<typeof ITEM_DISPLAY_ORDER>;
export type TNotesStyle           = ValueOf<typeof NOTES_STYLE>;
export type TShowPriceWithTax     = ValueOf<typeof SHOW_PRICE_WITH_TAX>;
export type TTitleAlignment       = ValueOf<typeof TITLE_ALIGNMENT>;
export type TSubTitleAlignment    = ValueOf<typeof SUB_TITLE_ALIGNMENT>;
export type TLogoSize             = ValueOf<typeof LOGO_SIZE>;
export type TDateFormat           = ValueOf<typeof DATE_FORMAT>;
export type TQrCodeAlignment      = ValueOf<typeof QR_CODE_ALIGNMENT>;
export type TRegTaxAlign          = ValueOf<typeof REG_TAX_ALIGN>;
export type TEmailBelow           = ValueOf<typeof EMAIL_BELOW>;
export type TMobileBelow          = ValueOf<typeof MOBILE_BELOW>;
export type TAddressAlignment     = ValueOf<typeof ADDRESS_ALIGNMENT>;
export type TCompanySign          = ValueOf<typeof COMPANY_SIGN>;
export type TSignatureAlignment   = ValueOf<typeof SIGNATURE_ALIGNMENT>;
export type TSignatureSize        = ValueOf<typeof SIGNATURE_SIZE>;
export type TShowTemplateForPages = ValueOf<typeof SHOW_TEMPLATE_FOR_PAGES>;
export type TPageNumberAlignment  = ValueOf<typeof PAGE_NUMBER_ALIGNMENT>;
export type TNotesFontSize        = ValueOf<typeof NOTES_FONT_SIZE>;

export const vals = <T extends Record<string, string>>(obj: T): string[] =>
  Object.values(obj);