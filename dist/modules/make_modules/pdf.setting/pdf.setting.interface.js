"use strict";
// export type TPDFSetting = {
//   style: {
//     text_color: string;
//     fill_color: string;
//     border_color: string;
//     fill_text_color: string;
//     font:| "arial"| "arial_bold"| "arial_italic"| "arial_bold_italic"
//       | "times"
//       | "times_bold"
//       | "times_italic"
//       | "times_bold_italic"
//       | "courier"
//       | "courier_bold"
//       | "courier_italic"
//       | "courier_bold_italic";
//     font_size: "small" | "normal" | "large" | "x-large" | "xx-large";
//     full_page: "yes" | "no";
//     horizontal_lines: "show" | "hide";
//     vertical_lines: "show" | "hide";
//     scaling: "fit_to_page" | "actual_size";
//     horizontal_alignment: "left" | "center" | "right";
//     vertical_alignment: "top" | "middle" | "bottom";
//     margin: {
//       top: number;
//       right: number;
//       bottom: number;
//       left: number;
//     };
//     outer_border: "show" | "hide";
//   };
//   columns: {
//     serial: boolean;
//     line_item_image: boolean;
//     variant_size: "with_product" | "separate_column" | "hide";
//     variant_type: "with_product" | "without_product" | "hide";
//     sku: boolean;
//     sac: boolean;
//     hsn: boolean;
//     quntity: "hide" | "show_for_both" | "show_for_product" | "show_for_service";
//     price: boolean;
//     discount: boolean;
//     tax: "hide" | "individual" | "combine";
//     line_item_tax_format:
//       | "show_as_percentage"
//       | "show_as_amount"
//       | "show_both_values";
//     item_display_order: "services_first" | "products_first" | "combined";
//     notes: "dark" | "light" | "hide";
//     line_total: boolean;
//     show_price_with_tax: "yes" | "no" | "default";
//     line_description_full_with: boolean;
//   };
//   header: {
//     title_alignment: "center" | "right";
//     sub_title_alignment: "center" | "right" | "left";
//     sub_title: boolean;
//     logo_size: "small" | "medium" | "large";
//     date_format: "short" | "medium" | "long";
//     logo: boolean;
//     header: boolean;
//     status_watermark: boolean;
//     number: boolean;
//     po_no: boolean;
//     due_date: boolean;
//     total_outstanding: boolean;
//     paid_amount: boolean;
//     qr_code: boolean;
//     qr_code_alignment: "left" | "center" | "right";
//     document_copy_label: boolean;
//     total_amount: boolean;
//     ganarated_by: boolean;
//     supply_type: boolean;
//     ganarated_date: boolean;
//     cancelled_date: boolean;
//     valid_till: boolean;
//   };
//   company: {
//     Reg_no: boolean;
//     reg_no_tax_id_align_below: "name" | "address";
//     tax_id: boolean;
//     name: boolean;
//     country: boolean;
//     address: boolean;
//     phone: boolean;
//     mobile: boolean;
//     fax: boolean;
//     email: boolean;
//     website: boolean;
//   };
//   contact: {
//     tax_id: boolean;
//     reg_no: boolean;
//     reg_no_tax_id_align_below: "name" | "address";
//     home_phone: boolean;
//     business_phone: boolean;
//     email: boolean;
//     email_below_contact: "name" | "address";
//     mobaile: boolean;
//     fax: boolean;
//     first_last_name: boolean;
//     mobile_below_contact: "name" | "address" , 
//     address_alignment : "left" |"right" ,
//     billing_adreess_alignment : "left" |"right" ,
//     shipping_adreess_alignment : "left" |"right" ,
//   };
//   summary: {
//     total_quantity: {
//         single_total : boolean,
//         group_by_unit : boolean ,
//     }
//     include_items_from :   {
//         products : boolean ,  
//         tasks : boolean
//     }
//     amount_unused : boolean , 
//     sub_total : boolean , 
//     discount : boolean ,
//     inline_discount : boolean ,
//     shipping_cost :  boolean , 
//     shipping_method : boolean ,
//     total :  boolean ,  
//     amount_due : boolean , 
//     amount_paid : boolean ,
//     amount_used : boolean ,
//     tax : "hide" | "individual" | "combine", 
//     tax_value : boolean , 
//     taxable_amount : boolean , 
//     tatal_in_words : boolean , 
//     hsc_sac_summary : boolean , 
//     return_order : boolean 
//   };
//   notes_terms: {
//     notes : boolean , 
//     notes_title : boolean , 
//     font_size : "small" | "medium" | "large" | "extra_large" , 
//     bank_details :  boolean ,
//     bank_details_title:  boolean  , 
//     full_with :  boolean , 
//     terms_and_condition : boolean
//   };
//   signature: {
//     company_sign : "hide" | "company" | "user" , 
//     contact_sign : boolean ,
//     company_signature_alignment : "center" | "right" | "left" , 
//     contact_signature_alignment : "center" | "right" | "left"
//     signature_size : "small" | "medium" | "large"
//   };
//   footer: {
//     created_moon_invoice_hyperlink : boolean ,  
//     show_tamplate_for_pages : "first" | "all" , 
//     page_number_alignment : "center" | "right" | "left"
//   };
// };
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfTypes = void 0;
var pdfTypes;
(function (pdfTypes) {
    pdfTypes["Invoice"] = "Invoice";
    pdfTypes["Sales_Receipt"] = "Sales_Receipt";
    pdfTypes["Proforma_Invoice"] = "Proforma_Invoice";
    pdfTypes["Estimate"] = "Estimate";
    pdfTypes["Delivery_Challan"] = "Delivery_Challan";
    pdfTypes["Bill"] = "Bill";
    pdfTypes["Purchase_Order"] = "Purchase_Order";
    pdfTypes["Credit_Note"] = "Credit_Note";
    pdfTypes["Payment_Received"] = "Payment_Received";
    pdfTypes["Payment_Made"] = "Payment_Made";
    pdfTypes["Debit_Note"] = "Debit_Note";
    pdfTypes["Statement"] = "Statement";
    pdfTypes["Packing_Slip"] = "Packing_Slip";
    pdfTypes["Delivery_Note"] = "Delivery_Note";
})(pdfTypes || (exports.pdfTypes = pdfTypes = {}));
