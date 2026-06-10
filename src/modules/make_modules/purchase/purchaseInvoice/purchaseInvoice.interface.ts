import { Types } from "mongoose";

export const purchaseInvoiceStatus = ["draft", "posted", "partial", "paid", "overdue"] as const;
export type TPurchaseInvoiceStatus = (typeof purchaseInvoiceStatus)[number];

export type TPurchaseInvoiceItemTax = {
  tax_name: string;
  tax_rate: number;
};

export type TPurchaseInvoiceItem = {
  product_id: Types.ObjectId;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  tax_percentage: number;
  tax_amount: number;
  total_amount: number;
  taxes?: TPurchaseInvoiceItemTax[];
};

export type TPurchaseInvoice = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  invoice_number?: string;
  invoice_date: Date;
  due_date: Date;
  vendor_id: Types.ObjectId;
  warehouse_id?: Types.ObjectId;
  items: TPurchaseInvoiceItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  debit_note_applied: number;
  balance_amount: number;
  status: TPurchaseInvoiceStatus;
  payment_terms?: string;
  notes?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
