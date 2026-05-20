import { Types } from "mongoose";

/** Shared address shape (former Customer/Vendor). */
export type TBusinessAddress = {
  street: string;
  zip: string;
  city: string;
  state: string;
  country: string;
};

/** Role-specific business data for customer and vendor users (same User model). */
export type TBusinessProfile = {
  companyName?: string;
  reg_no?: string;
  tax_id?: string;
  firstName?: string;
  lastName?: string;
  BusinessPhone?: string;
  fax?: string;
  mobile?: string;
  home_phone?: string;
  address?: TBusinessAddress;
  billingAddress?: TBusinessAddress;
  bank_details?: string;
  tax_service?: string;
  tax_product?: string;
  hourly_rate?: string;
  payment_terms_seles?: string;
  opening_balance?: number;
  opening_balance_date?: Date;
  notes?: string;
  payment_reminder?: boolean;
  active?: boolean;
  archive?: boolean;
};

/**
 * Customer/Vendor API body — IUser + businessProfile.
 * Flat fields (companyName, …) still accepted for backward compatibility.
 */
export type TPartyUserWrite = {
  _id?: Types.ObjectId;
  /** Company (tenant) id — set from auth in controller */
  user_id?: Types.ObjectId;
  name?: string;
  email?: string;
  /** Required on create (customer/vendor login) */
  password?: string;
  confirmPassword?: string;
  phone?: string;
  currency?: string;
  country?: string;
  businessProfile?: Partial<TBusinessProfile>;
  isDeleted?: boolean;
  companyName?: string;
  reg_no?: string;
  tax_id?: string;
  firstName?: string;
  lastName?: string;
  BusinessPhone?: string;
  fax?: string;
  mobile?: string;
  home_phone?: string;
  address?: TBusinessAddress;
  billingAddress?: TBusinessAddress;
  bank_details?: string;
  tax_service?: string;
  tax_product?: string;
  hourly_rate?: string;
  payment_terms_seles?: string;
  opening_balance?: number;
  opening_balance_date?: Date;
  notes?: string;
  payment_reminder?: boolean;
  active?: boolean;
  archive?: boolean;
};
