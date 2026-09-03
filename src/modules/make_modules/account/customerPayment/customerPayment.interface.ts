import { Types } from "mongoose";

export const paymentStatuses = ["pending", "cleared", "cancelled"] as const;

export type TPaymentAllocation = {
  invoice_id: Types.ObjectId;
  allocated_amount: number;
};

export type TCreditNoteApplication = {
  credit_note_id: Types.ObjectId;
  applied_amount: number;
};

export type TCustomerPayment = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  payment_number?: string;
  payment_date: Date;
  customer_id: Types.ObjectId;
  bank_account_id: Types.ObjectId;
  reference_number?: string;
  payment_amount: number;
  status: (typeof paymentStatuses)[number];
  notes?: string;
  allocations?: TPaymentAllocation[];
  credit_notes?: TCreditNoteApplication[];
  isDeleted?: boolean;
};
