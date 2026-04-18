import { Types } from "mongoose";
export enum InvoiceManagementType {
  Invoice = "Invoice",
  Sales_Receipt = "Sales_Receipt",
  Proforma_Invoice = "Proforma_Invoice",
  Estimate = "Estimate",
  Delivery_Challan = "Delivery_Challan",
  Credit_Note = "Credit_Note",
  Payment_Received = "Payment_Received",
}
export type TInvoiceManagement = {
  type: InvoiceManagementType;
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  customer_id: Types.ObjectId;
  invoice_number?: string;
  currency: string;
  date: Date;
  due_date: Date;
  sub_title: string;
  po: number | string;
  shipping_method: string;
  payment_method: string[];
  discount_before_tax: number;
  billing_address: {
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  shipping_address: {
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  product: [
    {
      product_id: Types.ObjectId;
      quantity: number;
      rate: number;
      tax: number;
      discount: number;
      amount: number;
    },
  ];
  service: [
    {
      service_id: Types.ObjectId;
      quantity: number;
      rate: number;
      tax: number;
      discount: number;
      amount: number;
    },
  ];
  terms_and_conditions: string;
  notes: string;
  internal_notes: string;
  Attachment: string;
  sub_total: number;
  deposit: number;
  discount: number;
  shipping_cost: number;
  total: number;
};
