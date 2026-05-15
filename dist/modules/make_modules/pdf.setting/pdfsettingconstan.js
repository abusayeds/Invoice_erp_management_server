"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vals = exports.NOTES_FONT_SIZE = exports.PAGE_NUMBER_ALIGNMENT = exports.SHOW_TEMPLATE_FOR_PAGES = exports.SIGNATURE_SIZE = exports.SIGNATURE_ALIGNMENT = exports.COMPANY_SIGN = exports.ADDRESS_ALIGNMENT = exports.MOBILE_BELOW = exports.EMAIL_BELOW = exports.REG_TAX_ALIGN = exports.QR_CODE_ALIGNMENT = exports.DATE_FORMAT = exports.LOGO_SIZE = exports.SUB_TITLE_ALIGNMENT = exports.TITLE_ALIGNMENT = exports.SHOW_PRICE_WITH_TAX = exports.NOTES_STYLE = exports.ITEM_DISPLAY_ORDER = exports.LINE_ITEM_TAX_FORMAT = exports.TAX_DISPLAY = exports.QUANTITY = exports.VARIANT_TYPE = exports.VARIANT_SIZE = exports.OUTER_BORDER = exports.ALIGNMENT_V = exports.ALIGNMENT_H = exports.SCALING = exports.LINES = exports.FULL_PAGE = exports.FONT_SIZE = exports.FONT = void 0;
exports.FONT = {
    arial: "arial",
    arial_bold: "arial_bold",
    arial_italic: "arial_italic",
    arial_bold_italic: "arial_bold_italic",
    times: "times",
    times_bold: "times_bold",
    times_italic: "times_italic",
    times_bold_italic: "times_bold_italic",
    courier: "courier",
    courier_bold: "courier_bold",
    courier_italic: "courier_italic",
    courier_bold_italic: "courier_bold_italic",
};
exports.FONT_SIZE = {
    small: "small",
    normal: "normal",
    large: "large",
    x_large: "x-large",
    xx_large: "xx-large",
};
exports.FULL_PAGE = { yes: "yes", no: "no" };
exports.LINES = { show: "show", hide: "hide" };
exports.SCALING = {
    fit_to_page: "fit_to_page",
    actual_size: "actual_size",
};
exports.ALIGNMENT_H = {
    left: "left",
    center: "center",
    right: "right",
};
exports.ALIGNMENT_V = {
    top: "top",
    middle: "middle",
    bottom: "bottom",
};
exports.OUTER_BORDER = { show: "show", hide: "hide" };
exports.VARIANT_SIZE = {
    with_product: "with_product",
    separate_column: "separate_column",
    hide: "hide",
};
exports.VARIANT_TYPE = {
    with_product: "with_product",
    without_product: "without_product",
    hide: "hide",
};
exports.QUANTITY = {
    hide: "hide",
    show_for_both: "show_for_both",
    show_for_product: "show_for_product",
    show_for_service: "show_for_service",
};
exports.TAX_DISPLAY = {
    hide: "hide",
    individual: "individual",
    combine: "combine",
};
exports.LINE_ITEM_TAX_FORMAT = {
    show_as_percentage: "show_as_percentage",
    show_as_amount: "show_as_amount",
    show_both_values: "show_both_values",
};
exports.ITEM_DISPLAY_ORDER = {
    services_first: "services_first",
    products_first: "products_first",
    combined: "combined",
};
exports.NOTES_STYLE = {
    dark: "dark",
    light: "light",
    hide: "hide",
};
exports.SHOW_PRICE_WITH_TAX = {
    yes: "yes",
    no: "no",
    default: "default",
};
exports.TITLE_ALIGNMENT = {
    center: "center",
    right: "right",
};
exports.SUB_TITLE_ALIGNMENT = {
    center: "center",
    right: "right",
    left: "left",
};
exports.LOGO_SIZE = {
    small: "small",
    medium: "medium",
    large: "large",
};
exports.DATE_FORMAT = {
    short: "short",
    medium: "medium",
    long: "long",
};
exports.QR_CODE_ALIGNMENT = {
    left: "left",
    center: "center",
    right: "right",
};
exports.REG_TAX_ALIGN = { name: "name", address: "address" };
exports.EMAIL_BELOW = { name: "name", address: "address" };
exports.MOBILE_BELOW = { name: "name", address: "address" };
exports.ADDRESS_ALIGNMENT = { left: "left", right: "right" };
exports.COMPANY_SIGN = {
    hide: "hide",
    company: "company",
    user: "user",
};
exports.SIGNATURE_ALIGNMENT = {
    center: "center",
    right: "right",
    left: "left",
};
exports.SIGNATURE_SIZE = {
    small: "small",
    medium: "medium",
    large: "large",
};
exports.SHOW_TEMPLATE_FOR_PAGES = {
    first: "first",
    all: "all",
};
exports.PAGE_NUMBER_ALIGNMENT = {
    center: "center",
    right: "right",
    left: "left",
};
exports.NOTES_FONT_SIZE = {
    small: "small",
    medium: "medium",
    large: "large",
    extra_large: "extra_large",
};
const vals = (obj) => Object.values(obj);
exports.vals = vals;
