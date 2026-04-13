import mongoose, { Schema, Document } from "mongoose";
import { TSetting } from "./app.setting.interface";

export type TSettingDocument = TSetting & Document;
const columnsSchema = new Schema(
  {
    task_name:                    { type: Boolean, default: false },
    product_name:                 { type: Boolean, default: true  },
    description:                  { type: Boolean, default: true  },
    quantity:                     { type: Boolean, default: true  },
    discount:                     { type: Boolean, default: false },
    tax:                          { type: Boolean, default: false },
    line_description_full_width:  { type: Boolean, default: false },
    buy_price_in_suggestion_list: { type: Boolean, default: false },
    item_code_in_suggestion_list: { type: Boolean, default: false },
  },
  { _id: false }
);

const summarySchema = new Schema(
  {
    total_quantity:               { type: Boolean, default: false },
    roundOff:                     { type: Boolean, default: false },
    negative_value_with:          { type: Boolean, default: false },
    contact_note_as_default_note: { type: Boolean, default: false },
    show_line_total_with_tax:     { type: Boolean, default: false },
    inline_discount:              { type: Boolean, default: false },
  },
  { _id: false }
);

const printEmailSchema = new Schema(
  { combine_pdf_in_email: { type: Boolean, default: false } },
  { _id: false }
);

const generalDocSchema = new Schema(
  {
    shipping_address:          { type: Boolean, default: false },
    shipping_cost_method:      { type: Boolean, default: false },
    apply_discount_before_tax: { type: Boolean, default: false },
    line_option:               { type: Boolean, default: false },
  },
  { _id: false }
);
const settingSchema = new Schema<TSettingDocument>(
  {
    user_id: { type:     Schema.Types.ObjectId, ref:      "User", required: true, unique:   true, index:    true,},
    general: {
      chat:    { type: Boolean, default: true },
      default: {
        type:    String,
        enum:    ["System Default","Moon Mail Server","Mail App","Outlook App","Airmail App","Postbox App","Gmail","Outlook"],
        default: "System Default",
      },
    },

    modules: {
      invoice:          { type: Boolean , default: true },
      bill:             { type: Boolean , default: true },
      sales_receipt:    { type: Boolean , default: true },
      estimate:         { type: Boolean , default: true },
      delivery_challan: { type: Boolean , default: true },
      proforma_invoice: { type: Boolean , default: true },
      credit_note:      { type: Boolean , default: true },
      debit_note:       { type: Boolean , default: true },
      payment_received: { type: Boolean , default: true },
      payment_made:     { type: Boolean , default: true },
      expense:          { type: Boolean , default: true },
      packing_slip:     { type: Boolean , default: true },
      time_log:         { type: Boolean , default: true },
      purchase_order:   { type: Boolean , default: true },
      project:          { type: Boolean , default: true },
      team:             { type: Boolean , default: true },
    },

    currency_format: {
      currency_symbol: { type: String, enum: ["on","off"], default: "on"  },
      currency_code:   { type: String, enum: ["on","off"], default: "off" },
      decimal_places:  { type: Number, default: 2, min: 0, max: 4 },
    },

    whatsApp: {
      enabled:          { type: Boolean, default: false },
      send_via:         { type: String, enum: ["moon_invoice"], default: "moon_invoice" },
      terms_conditions: { type: Boolean, default: false },
      notes:            { type: Boolean, default: false },
    },

    invoice: {
      general: {
        due_date:                  { type: Boolean, default: true  },
        shipping_address:          { type: Boolean, default: false },
        shipping_cost_method:      { type: Boolean, default: false },
        apply_discount_before_tax: { type: Boolean, default: false },
        line_option:               { type: Boolean, default: false },
      },
      columns:     columnsSchema,
      summary:     summarySchema,
      print_email: {
        mark_as_sent_on_print:             { type: Boolean, default: false },
        mark_as_sent_on_email_or_whatsApp: { type: Boolean, default: false },
        combine_pdf_in_email:              { type: Boolean, default: false },
      },
    },

    sales_receipt:    { general: generalDocSchema, columns: columnsSchema, summary: summarySchema, print_email: printEmailSchema },
    estimate:         { general: generalDocSchema, columns: columnsSchema, summary: summarySchema, print_email: printEmailSchema },
    delivery_challan: { general: generalDocSchema, columns: columnsSchema, summary: summarySchema, print_email: printEmailSchema },
    purchase_order:   { general: generalDocSchema, columns: columnsSchema, summary: summarySchema, print_email: printEmailSchema },
    proforma_invoice: { general: generalDocSchema, columns: columnsSchema, summary: summarySchema, print_email: printEmailSchema },
    bill:             { general: generalDocSchema, columns: columnsSchema, summary: summarySchema, print_email: printEmailSchema },
    debit_note:       { general: generalDocSchema, columns: columnsSchema, summary: summarySchema, print_email: printEmailSchema },
    credit_note:      { general: generalDocSchema, columns: columnsSchema, summary: summarySchema, print_email: printEmailSchema },

    expense: {
      payment_type: { type: Boolean, default: false },
      round_off:    { type: Boolean, default: false },
    },

    product: {
      general: {
        hsn:                      { type: Boolean, default: false },
        product_img_on_line_item: { type: Boolean, default: false },
        inventory:                { type: Boolean, default: false },
      },
      stock: {
        product_stock: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

export const SettingModel = mongoose.model<TSettingDocument>("Setting", settingSchema);
