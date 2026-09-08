import { Types } from "mongoose";

// One terms-and-conditions config per company — a default block per document type
// (Laravel "Terms & Conditions" settings). NOTE: separate from the global marketing `terms` module.
export interface TTermsCondition {
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
