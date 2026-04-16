import { Types } from "mongoose";
export type TAddress = {
  street: string;
  zip: string;
  city: string;
  state: string;
  country: string;
};
export type TVendor = {
  _id?: Types.ObjectId;
  user_id?: Types.ObjectId;
  companyName: string;
  email: string;
  reg_no: string;
  tax_id: string;
  firstName: string;
  lastName: string;
  BusinessPhone: string;
  fax: string;
  mobile: string;
  home_phone: string;
  address: TAddress;
  billingAddress: TAddress;
  bank_details: string;
  currency: string;
  tax_service: string;
  tax_product: string;
  hourly_rate: string;
  payment_terms_seles: string;
  opening_balance: number;
  opening_balance_date: Date;
  notes: string;
  payment_reminder: boolean;
  custormer: boolean;
  vendor: boolean;
  active : boolean , 
  isDeleted : boolean
  archive : boolean
};
