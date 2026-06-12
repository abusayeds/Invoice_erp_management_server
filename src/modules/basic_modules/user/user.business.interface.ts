import { Types } from "mongoose";

/** Customer/Vendor address — matches the Laravel `billing_address` / `shipping_address` shape. */
export type TPartyAddress = {
  name?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
};

/** @deprecated old name — use TPartyAddress. */
export type TBusinessAddress = TPartyAddress;

/**
 * Business data for customer / vendor users (stored on the same User model).
 * Only the fields the Laravel customer/vendor forms collect — nothing extra.
 * Common identity fields (name, email, phone) live on the User itself, not here.
 */
export type TBusinessProfile = {
  companyName?: string; // company_name
  tax_number?: string;
  payment_terms?: string;
  billing_address?: TPartyAddress;
  shipping_address?: TPartyAddress;
  same_as_billing?: boolean;
  notes?: string;
  /** system flags (soft delete / listing) */
  active?: boolean;
  archive?: boolean;
};

/**
 * Customer / Vendor create + update body.
 * Common identity fields use their natural names (name / email / phone) and map to the User;
 * the rest map into businessProfile.
 */
export type TPartyUserWrite = {
  _id?: Types.ObjectId;
  /** Company (tenant) id — set from the auth token in the controller, not by the client. */
  user_id?: Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  tax_number?: string;
  payment_terms?: string;
  billing_address?: TPartyAddress;
  shipping_address?: TPartyAddress;
  same_as_billing?: boolean;
  notes?: string;
  /** system flags */
  isDeleted?: boolean;
  active?: boolean;
  archive?: boolean;
};
