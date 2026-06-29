import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../errors/AppError";
import { UserModel } from "../modules/basic_modules/user/user.model";
import { IUser } from "../modules/basic_modules/user/user.interface";
import {
  TBusinessProfile,
  TPartyAddress,
  TPartyUserWrite,
} from "../modules/basic_modules/user/user.business.interface";
import { role as roleEnum, CUSTOMER_ROLE_VALUES, isCustomerRole } from "./role";
export { roleEnum as role, isCustomerRole, CUSTOMER_ROLE_VALUES };

type PartyRole = typeof roleEnum.customer | typeof roleEnum.vendor;

const ADDRESS_REQUIRED_FIELDS: (keyof TPartyAddress)[] = [
  "name",
  "address_line_1",
  "city",
  "state",
  "country",
  "zip_code",
];

const requireAddress = (address: TPartyAddress | undefined, label: string) => {
  if (!address) {
    throw new AppError(httpStatus.BAD_REQUEST, `${label} is required`);
  }
  for (const field of ADDRESS_REQUIRED_FIELDS) {
    if (!String(address[field] ?? "").trim()) {
      throw new AppError(httpStatus.BAD_REQUEST, `${label} ${field.replace(/_/g, " ")} is required`);
    }
  }
};

/**
 * Customer/vendor create validation — mirrors the Laravel StoreCustomer/StoreVendor rules.
 * company_name + name + billing_address are always required;
 * email is required for customers only; shipping_address required unless same_as_billing.
 */
export const validatePartyCreateBody = (payload: TPartyUserWrite, partyRole: PartyRole) => {
  if (!payload.company_name?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Company name is required");
  }
  if (!payload.name?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Name is required");
  }
  if (partyRole === roleEnum.customer && !payload.email?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  }
  requireAddress(payload.billing_address, "Billing address");
  if (!payload.same_as_billing) {
    requireAddress(payload.shipping_address, "Shipping address");
  }
};

export const PARTY_SEARCH_FIELDS = [
  "name",
  "email",
  "phone",
  "businessProfile.companyName",
  "businessProfile.tax_number",
] as const;

export const CLIENT_POPULATE_SELECT = "name ";

const roleQuery = (partyRole: PartyRole) => {
  if (partyRole === roleEnum.customer) {
    return { $in: [...CUSTOMER_ROLE_VALUES] };
  }
  return partyRole;
};

export const partyBaseFilter = (companyId: Types.ObjectId | string, partyRole: PartyRole) => ({
  companyId,
  role: roleQuery(partyRole),
  isDeleted: false,
  "businessProfile.active": true,
  "businessProfile.archive": false,
});

export const assertPartyUser = async (
  id: Types.ObjectId | string,
  partyRole: PartyRole,
  notFoundLabel = "User"
) => {
  const user = await UserModel.findOne({
    _id: id,
    role: roleQuery(partyRole),
    isDeleted: false,
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `${notFoundLabel} not found`);
  }
  return user;
};

export const assertCustomerUser = (id: Types.ObjectId | string) =>
  assertPartyUser(id, roleEnum.customer, "Customer");

/** @deprecated use assertCustomerUser */
export const assertClientUser = assertCustomerUser;

export const assertVendorUser = (id: Types.ObjectId | string) =>
  assertPartyUser(id, roleEnum.vendor, "Vendor");

/** Build the businessProfile sub-document from the create payload. */
const buildProfile = (payload: TPartyUserWrite): TBusinessProfile => ({
  companyName: payload.company_name,
  tax_number: payload.tax_number,
  payment_terms: payload.payment_terms,
  billing_address: payload.billing_address,
  shipping_address: payload.same_as_billing ? payload.billing_address : payload.shipping_address,
  same_as_billing: payload.same_as_billing ?? false,
  notes: payload.notes,
  active: payload.active ?? true,
  archive: payload.archive ?? false,
});

export const mapPartyPayloadToUser = (
  payload: TPartyUserWrite,
  companyId: Types.ObjectId | string,
  partyRole: PartyRole
): Partial<IUser> => ({
  // Common identity fields live on the User itself.
  name: payload.name,
  email: payload.email,
  phone: payload.phone,
  role: partyRole,
  companyId: companyId as IUser["companyId"],
  businessProfile: buildProfile(payload),
  isDeleted: payload.isDeleted ?? false,
  isVerify: false,
  login: false,
});

/**
 * Partial update — only the provided keys change. businessProfile fields use dot-notation
 * so a partial edit (or the soft-delete flags) never wipes the rest of the profile.
 */
export const applyPartyUpdateToUser = (payload: TPartyUserWrite): Record<string, unknown> => {
  const update: Record<string, unknown> = {};

  if (payload.name !== undefined) update.name = payload.name;
  if (payload.email !== undefined) update.email = payload.email;
  if (payload.phone !== undefined) update.phone = payload.phone;

  const setProfile = (key: keyof TBusinessProfile, value: unknown) => {
    if (value !== undefined) update[`businessProfile.${key}`] = value;
  };
  setProfile("companyName", payload.company_name);
  setProfile("tax_number", payload.tax_number);
  setProfile("payment_terms", payload.payment_terms);
  setProfile("billing_address", payload.billing_address);
  setProfile(
    "shipping_address",
    payload.same_as_billing ? payload.billing_address : payload.shipping_address
  );
  setProfile("same_as_billing", payload.same_as_billing);
  setProfile("notes", payload.notes);
  setProfile("active", payload.active);
  setProfile("archive", payload.archive);

  if (typeof payload.isDeleted === "boolean") update.isDeleted = payload.isDeleted;
  return update;
};

export const toPartyUserResponse = (user: IUser): IUser => {
  const doc = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete (doc as { password?: string }).password;
  return doc as IUser;
};
