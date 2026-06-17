import mongoose, { Schema, Document } from "mongoose";
import { TSetting } from "./app.setting.interface";

export type TSettingDocument = TSetting & Document;

// ── Shared document-type sub-schemas (superset of every document's fields) ──
const docFieldVisibilitySchema = new Schema(
  {
    due_date: Boolean,
    shipping_address: Boolean,
    street1: Boolean,
    street2: Boolean,
    zip_code: Boolean,
    city: Boolean,
    state: Boolean,
    country: Boolean,
    sub_title: Boolean,
    po: Boolean,
    recipient_name: Boolean,
    shipping_cost_and_method: Boolean,
    salesperson: Boolean,
    payment_methods: Boolean,
    payment_type: Boolean,
    apply_discount_before_tax: Boolean,
    terms_conditions: Boolean,
    notes: Boolean,
    attachment: Boolean,
  },
  { _id: false }
);

const docGeneralSchema = new Schema(
  {
    line_option: String,
    track_purchase_orders_in_stock: Boolean,
  },
  { _id: false }
);

const docColumnsSchema = new Schema(
  {
    service_name: Boolean,
    product_name: Boolean,
    description: Boolean,
    quantity: String,
    discount: Boolean,
    mrp: Boolean,
    tax: Boolean,
    line_description_full_width: Boolean,
    stock_in_suggestion_list: Boolean,
    description_in_suggestion_list: Boolean,
    buy_price_in_suggestion_list: Boolean,
    sell_price_in_suggestion_list: Boolean,
    item_code_in_suggestion_list: Boolean,
    auto_fit: Boolean,
  },
  { _id: false }
);

const docSummarySchema = new Schema(
  {
    total_quantity: Boolean,
    round_off: Boolean,
    negative_value_format: Boolean,
    subtotal_with_tax: String,
    contact_note_as_default_note: Boolean,
    show_line_total_with_tax: Boolean,
  },
  { _id: false }
);

const docPrintEmailSchema = new Schema(
  {
    mark_as_sent_on_print: Boolean,
    mark_as_sent_on_email_or_whatsApp: Boolean,
    combine_pdf_in_email: Boolean,
    number_of_copies_on_print: String,
  },
  { _id: false }
);

const documentSchema = () =>
  new Schema(
    {
      field_visibility: docFieldVisibilitySchema,
      general: docGeneralSchema,
      columns: docColumnsSchema,
      summary: docSummarySchema,
      print_email: docPrintEmailSchema,
    },
    { _id: false }
  );

const settingSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },

    general: {
      chat: Boolean,
      create_public_url_in_email: Boolean,
      appearance: String,
      default_mail: String,
    },

    modules: {
      invoice: Boolean,
      proforma_invoice: Boolean,
      estimate: Boolean,
      delivery_challan: Boolean,
      bill: Boolean,
      credit_note: Boolean,
      debit_note: Boolean,
      expense: Boolean,
      sales_receipt: Boolean,
      packing_slip: Boolean,
      time_log: Boolean,
      purchase_order: Boolean,
      project: Boolean,
      team: Boolean,
      payment_received: Boolean,
      payment_made: Boolean,
      integrations: Boolean,
      banking: Boolean,
      rewards: Boolean,
      product: Boolean,
      service: Boolean,
      report: Boolean,
      pos: Boolean,
      my_documents: Boolean,
    },

    currency_format: {
      currency: String,
      currency_symbol: Boolean,
      currency_code: Boolean,
      multi_currency_display: Boolean,
      exchange_rates: Boolean,
      decimal_places: Number,
      date_number_format: String,
      language: String,
      timezone: String,
    },

    printer: {
      print_mode: String,
    },

    whatsApp: {
      enabled: Boolean,
      send_via: String,
    },

    invoice: documentSchema(),
    proforma_invoice: documentSchema(),
    sales_receipt: documentSchema(),
    estimate: documentSchema(),
    delivery_challan: documentSchema(),
    purchase_order: documentSchema(),
    bill: documentSchema(),
    credit_note: documentSchema(),
    debit_note: documentSchema(),

    expense: {
      round_off: Boolean,
      payment_type: Boolean,
    },

    product: {
      field_visibility: {
        hsn: Boolean,
        inventory: Boolean,
        mrp: Boolean,
      },
      general: {
        product_img_on_line_item: Boolean,
        allow_zero_stock: Boolean,
      },
      stock: {
        product_stock: Boolean,
      },
    },

    service: {
      sac: Boolean,
    },

    time_log: {
      columns: {
        include_project_in_create_invoice: Boolean,
        include_date_in_create_invoice: Boolean,
        include_notes_in_create_invoice: Boolean,
      },
      summary: {
        time_log_rounding: String,
      },
    },
  },
  { timestamps: true }
);

export const SettingModel = mongoose.model<TSettingDocument>("Setting", settingSchema);
