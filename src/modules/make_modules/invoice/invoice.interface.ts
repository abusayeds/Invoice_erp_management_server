import { Types } from 'mongoose';

export const invoiceStatus = ['Draft', 'Partial', 'Paid', 'Overdue', 'Recurring', 'Void', 'CreditNotesApplied', 'Open'] as const;
type Status = (typeof invoiceStatus)[number];

export const invoiceRecurring = ['Never', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'] as const;

export type TInvoice = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  customer_id?: Types.ObjectId;
  warehouse_id?: Types.ObjectId;
  invoice_number?: string;
  currency?: string;
  date?: Date;
  due_date?: Date;
  sub_title?: string;
  po?: number | string;
  recipient_name?: string;
  shipping_method?: string;
  salesperson?: Types.ObjectId;
  recurring?: (typeof invoiceRecurring)[number];
  payment_method?: string[];
  discount_before_tax?: number;
  billing_address?: {
    street: string;
    street2?: string;
    city: string;
    state?: string;
    zip?: string;
    country: string;
  };
  shipping_address?: {
    street: string;
    street2?: string;
    city: string;
    state?: string;
    zip?: string;
    country: string;
  };
  product?: [
    {
      product_id?: Types.ObjectId;
      product_name?: string;
      description?: string;
      quantity: number;
      rate: number;
      tax: number;
      discount: number;
      amount: number;
    }
  ];
  service?: [
    {
      service_id: Types.ObjectId;
      quantity: number;
      rate: number;
      tax: number;
      discount: number;
      amount: number;
    }
  ];
  status: Status;
  terms_and_conditions?: string;
  notes?: string;
  internal_notes?: string;
  Attachment?: string;
  sub_total: number;
  deposit: number | string;
  discount: number | string;
  shipping_cost: number | string;
  inline_discount: number;
  tax: number;
  total: number;
  paid_amount?: number;
  balance_amount?: number;
  isDeleted: boolean;
  isArchive: boolean;
  createdAt?: Date;
};
