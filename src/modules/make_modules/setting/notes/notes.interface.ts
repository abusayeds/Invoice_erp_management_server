import { Types } from "mongoose";

// One notes config per company — a default note per document type (Laravel "Notes" settings).
export interface TNotes {
  _id?: string;
  user_id?: Types.ObjectId;
  invoice?: string;
  sales_receipt?: string;
  proforma_invoice?: string;
  estimate?: string;
  delivery_challan?: string;
  purchase_order?: string;
  credit_note?: string;
  bill?: string;
  debit_note?: string;
}
