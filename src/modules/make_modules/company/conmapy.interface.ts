import { Document, Types } from "mongoose";

export type TAddress = {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type TCompany = {
  user_id : Types.ObjectId
  companyLogo: string;
  businessName: string;
  email: string;
  phone: string;
  mobile: string;
  fax: string;
  website: string;
  billingAddress: TAddress;
  shippingAddress: TAddress;
  reg_No: string;
  tax_id: string;
  payment_terms_seles: string;
  payment_terms_purchase: string;
  financialYear: string;
};
