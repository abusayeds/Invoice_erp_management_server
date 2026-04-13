

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

//   delivery_challan: {
//     general: {
//       shipping_address: boolean;
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
//   purchase_order: {
//     general: {
//       shipping_address: boolean;
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
//   proforma_invoice: {
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
//   Bill: {
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
//   debit_note: {
//     general: {
//       shipping_address: boolean;
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
//   credit_note: {
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
//   expense: {
//     payment_type: boolean;
//     pound_Off: boolean;
//   };
//   product: {
//     general  : {
//         hsn : boolean
//         product_img_on_line_item : boolean
//         inventory : boolean
//     } , 
//     stock  :  {
//         product_stock :  boolean
//     }
//   };
//   Services: {};
// };



import { Types } from "mongoose";

export type TSettingType =
  | "general"
  | "modules"
  | "currency_format"
  | "whatsApp"
  | "invoice"
  | "sales_receipt"
  | "estimate"
  | "delivery_challan"
  | "purchase_order"
  | "proforma_invoice"
  | "bill"
  | "debit_note"
  | "credit_note"
  | "expense"
  | "product";
export type TDocumentSubType = "general" | "columns" | "summary" | "print_email";
export type TProductSubType  = "general" | "stock";
export type TSettingSubType  = TDocumentSubType | TProductSubType;
export type TSetting = {
  user_id: Types.ObjectId;

  general: {
    chat: boolean;
    default:
      | "System Default"
      | "Moon Mail Server"
      | "Mail App"
      | "Outlook App"
      | "Airmail App"
      | "Postbox App"
      | "Gmail"
      | "Outlook";
  };

  modules: {
    invoice: boolean
    bill: boolean
    sales_receipt: boolean
    estimate: boolean
    delivery_challan: boolean
    proforma_invoice: boolean
    credit_note: boolean
    debit_note: boolean
    payment_received: boolean
    payment_made: boolean
    expense: boolean
    packing_slip: boolean
    time_log: boolean
    purchase_order: boolean
    project: boolean
    team: boolean
  };

  currency_format: {
    currency_symbol: "on" | "off";
    currency_code: "on" | "off";
    decimal_places: number;
  };

  whatsApp: {
    enabled: boolean;
    send_via: "moon_invoice";
    terms_conditions: boolean;
    notes: boolean;
  };

  invoice: {
    general: {
      due_date: boolean;
      shipping_address: boolean;
      shipping_cost_method: boolean;
      apply_discount_before_tax: boolean;
      line_option: boolean;
    };
    columns: TColumns;
    summary: TSummary;
    print_email: {
      mark_as_sent_on_print: boolean;
      mark_as_sent_on_email_or_whatsApp: boolean;
      combine_pdf_in_email: boolean;
    };
  };

  sales_receipt: TDocumentModule;
  estimate: TDocumentModule;
  delivery_challan: TDocumentModule;
  purchase_order: TDocumentModule;
  proforma_invoice: TDocumentModule;
  bill: TDocumentModule;
  debit_note: TDocumentModule;
  credit_note: TDocumentModule;

  expense: {
    payment_type: boolean;
    round_off: boolean;
  };

  product: {
    general: {
      hsn: boolean;
      product_img_on_line_item: boolean;
      inventory: boolean;
    };
    stock: {
      product_stock: boolean;
    };
  };
};

export type TColumns = {
  task_name: boolean;
  product_name: boolean;
  description: boolean;
  quantity: boolean;
  discount: boolean;
  tax: boolean;
  line_description_full_width: boolean;
  buy_price_in_suggestion_list: boolean;
  item_code_in_suggestion_list: boolean;
};

export type TSummary = {
  total_quantity: boolean;
  roundOff: boolean;
  negative_value_with: boolean;
  contact_note_as_default_note: boolean;
  show_line_total_with_tax: boolean;
  inline_discount: boolean;
};

export type TDocumentModule = {
  general: {
    shipping_address: boolean;
    shipping_cost_method: boolean;
    apply_discount_before_tax: boolean;
    line_option: boolean;
  };
  columns: TColumns;
  summary: TSummary;
  print_email: {
    combine_pdf_in_email: boolean;
  };
};