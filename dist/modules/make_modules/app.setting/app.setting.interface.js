"use strict";
// export type TSetting = {
//   general: {
//     chat: boolean;
//     default:
//       | "System Default"
//       | "Moon Mail Server"
//       | "Mail App"
//       | "Outlook App"
//       | "Airmail App"
//       | "Postbox App"
//       | "Gmail"
//       | "Outlook";
//   };
//   modules: {
//     invoice: "hide" | "show";
//     bill: "hide" | "show";
//     sales_receipt: "hide" | "show";
//     estimate: "hide" | "show";
//     delivery_challan: "hide" | "show";
//     proforma_invoice: "hide" | "show";
//     credit_note: "hide" | "show";
//     debit_note: "hide" | "show";
//     payment_received: "hide" | "show";
//     payment_made: "hide" | "show";
//     expense: "hide" | "show";
//     packing_slip: "hide" | "show";
//     time_log: "hide" | "show";
//     purchase_order: "hide" | "show";
//     project: "hide" | "show";
//     team: "hide" | "show";
//   };
//   currency_Format: {
//     currency_symbol: "on" | "off";
//     currency_code: "on" | "off";
//     decimal_places: number;
//   };
//   whatsApp: {
//     whatApp: boolean;
//     send_via: "moon_invoice";
//     whatsApp_terms_conditions: boolean;
//     whatsApp_notes: boolean;
//   };
//   invoice: {
//     general: {
//       due_date: boolean;
//       shipping_address: boolean;
//       shipping_cost_method: boolean;
//       apply_discount_before_tax: boolean;
//       line_option: boolean;
//     };
//     columns: {
//       task_name: boolean;
//       product_name: boolean;
//       description: boolean;
//       quantity: boolean;
//       discount: boolean;
//       tax: boolean;
//       line_description_full_width: boolean;
//       buy_price_in_suggestion_list: boolean;
//       item_code_in_suggestion_list: boolean;
//     };
//     summary: {
//       total_quantity: boolean;
//       roundOff: boolean;
//       negative_value_with: boolean;
//       contact_note_as_default_note: boolean;
//       show_line_total_with_tax: boolean;
//     };
//     print_email: {
//       mark_as_sent_on_print: boolean;
//       mark_as_sent_on_email_or_whatsApp: boolean;
//       combine_pdf_in_email: boolean;
//     };
//   };
//   sales_receipt: {
//     general: {
//       shipping_address: boolean;
//       shipping_cost_method: boolean;
//       apply_discount_before_tax: boolean;
//       line_option: boolean;
//     };
//     columns: {
//       task_name: boolean;
//       product_name: boolean;
//       description: boolean;
//       quantity: boolean;
//       discount: boolean;
//       tax: boolean;
//       line_description_full_width: boolean;
//       buy_price_in_suggestion_list: boolean;
//       item_code_in_suggestion_list: boolean;
//     };
//     summary: {
//       total_quantity: boolean;
//       roundOff: boolean;
//       negative_value_with: boolean;
//       contact_note_as_default_note: boolean;
//       show_line_total_with_tax: boolean;
//     };
//     print_email: {
//       combine_pdf_in_email: boolean;
//     };
//   };
//   estimate: {
//     general: {
//       shipping_address: boolean;
//       shipping_cost_method: boolean;
//       apply_discount_before_tax: boolean;
//       line_option: boolean;
//     };
//     columns: {
//       task_name: boolean;
//       product_name: boolean;
//       description: boolean;
//       quantity: boolean;
//       discount: boolean;
//       tax: boolean;
//       line_description_full_width: boolean;
//       buy_price_in_suggestion_list: boolean;
//       item_code_in_suggestion_list: boolean;
//     };
//     summary: {
//       total_quantity: boolean;
//       roundOff: boolean;
//       negative_value_with: boolean;
//       contact_note_as_default_note: boolean;
//       inline_iscount: boolean;
//       show_line_total_with_tax: boolean;
//     };
//     print_email: {
//       combine_pdf_in_email: boolean;
//     };
//   };
Object.defineProperty(exports, "__esModule", { value: true });
