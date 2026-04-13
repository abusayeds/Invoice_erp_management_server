export const setting_seed_data = {
  general: {
    chat: true,
    default: "System Default",
  },
  modules: {
    invoice: true,
    bill: true,
    sales_receipt: true,
    estimate: true,
    delivery_challan: true,
    proforma_invoice: true,
    credit_note: true,
    debit_note: true,
    payment_received: true,
    payment_made: true,
    expense: true,
    packing_slip: true,
    time_log: true,
    purchase_order: true,
    project: true,
    team: true,
  },

  currency_format: {
    currency_symbol: "on",
    currency_code: "on",
    decimal_places: 2,
  },

  whatsApp: {
    enabled: true,
    send_via: "moon_invoice",
    terms_conditions: true,
    notes: true,
  },

  invoice: {
    general: {
      due_date: true,
      shipping_address: true,
      shipping_cost_method: true,
      apply_discount_before_tax: true,
      line_option: true,
    },
    columns: {
      task_name: true,
      product_name: true,
      description: true,
      quantity: true,
      discount: true,
      tax: true,
      line_description_full_width: true,
      buy_price_in_suggestion_list: true,
      item_code_in_suggestion_list: true,
    },
    summary: {
      total_quantity: true,
      roundOff: true,
      negative_value_with: true,
      contact_note_as_default_note: true,
      show_line_total_with_tax: true,
      inline_discount: true,
    },
    print_email: {
      mark_as_sent_on_print: true,
      mark_as_sent_on_email_or_whatsApp: true,
      combine_pdf_in_email: true,
    },
  },

  sales_receipt: {
    general: {
      shipping_address: true,
      shipping_cost_method: true,
      apply_discount_before_tax: true,
      line_option: true,
    },
    columns: {
      task_name: true,
      product_name: true,
      description: true,
      quantity: true,
      discount: true,
      tax: true,
      line_description_full_width: true,
      buy_price_in_suggestion_list: true,
      item_code_in_suggestion_list: true,
    },
    summary: {
      total_quantity: true,
      roundOff: true,
      negative_value_with: true,
      contact_note_as_default_note: true,
      show_line_total_with_tax: true,
      inline_discount: true,
    },
    print_email: {
      combine_pdf_in_email: true,
    },
  },

  estimate: { $ref: "sales_receipt" },
  delivery_challan: { $ref: "sales_receipt" },
  purchase_order: { $ref: "sales_receipt" },
  proforma_invoice: { $ref: "sales_receipt" },
  bill: { $ref: "sales_receipt" },
  debit_note: { $ref: "sales_receipt" },
  credit_note: { $ref: "sales_receipt" },

  expense: {
    payment_type: true,
    round_off: true,
  },

  product: {
    general: {
      hsn: true,
      product_img_on_line_item: true,
      inventory: true,
    },
    stock: {
      product_stock: true,
    },
  },
};
