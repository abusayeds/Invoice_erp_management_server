import httpStatus from "http-status";
import { FilterQuery, Types } from "mongoose";
import { parseBoolQuery } from "../builder/queryBuilder";
import AppError from "../errors/AppError";
import { UserModel } from "../modules/basic_modules/user/user.model";
import { IUser } from "../modules/basic_modules/user/user.interface";
import {
  TBusinessProfile,
  TPartyUserWrite,
} from "../modules/basic_modules/user/user.business.interface";
import { role as roleEnum, CUSTOMER_ROLE_VALUES, isCustomerRole } from "./role";
import { loadStoredRolePermissions } from "./userPermissions";
export { roleEnum as role, isCustomerRole, CUSTOMER_ROLE_VALUES };

type PartyRole = typeof roleEnum.customer | typeof roleEnum.vendor;

/**
 * Customer/vendor create — only company_name, email, and password are required.
 * All other fields (name, address, phone, etc.) are optional.
 */
export const validatePartyCreateBody = (payload: TPartyUserWrite, _partyRole: PartyRole) => {
  if (!payload.company_name?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Company name is required");
  }
  if (!payload.email?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  }
  if (!payload.password?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }
};

export const PARTY_SEARCH_FIELDS = [
  "name",
  "email",
  "phone",
  "designation",
  "businessProfile.companyName",
  "businessProfile.tax_number",
  "businessProfile.registration_number",
  "businessProfile.business_phone",
] as const;

export const CLIENT_POPULATE_SELECT = "name ";

/** List API — only fields needed for customer/vendor table rows. */
export const PARTY_LIST_SELECT =
  "name email phone designation businessProfile.companyName businessProfile.opening_balance businessProfile.opening_balance_date businessProfile.active businessProfile.isArchive";

export type TPartyListItem = {
  _id: unknown;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  designation?: string | null;
  company_name?: string | null;
  opening_balance?: number;
  opening_balance_date?: Date | null;
  active?: boolean;
  isArchive?: boolean;
};

export const toPartyListItem = (user: IUser): TPartyListItem => {
  const doc =
    typeof user.toObject === "function"
      ? user.toObject()
      : ({ ...user } as Record<string, unknown>);
  const profile = (doc.businessProfile ?? {}) as TBusinessProfile;
  return {
    _id: doc._id,
    name: (doc.name as string | undefined) ?? null,
    email: (doc.email as string | undefined) ?? null,
    phone: (doc.phone as string | undefined) ?? null,
    designation: (doc.designation as string | undefined) ?? null,
    company_name: profile.companyName ?? null,
    opening_balance: profile.opening_balance ?? 0,
    opening_balance_date: profile.opening_balance_date ?? null,
    active: profile.active ?? true,
    isArchive: profile.isArchive ?? false,
  };
};

const roleQuery = (partyRole: PartyRole) => {
  if (partyRole === roleEnum.customer) {
    return { $in: [...CUSTOMER_ROLE_VALUES] };
  }
  return partyRole;
};

/**
 * List/filter customers and vendors from the shared User collection.
 * Default hides deleted + archived.
 * ?isDeleted=true — only deleted rows (archive filter skipped).
 * ?isArchive=true — only archived rows (isDeleted filter skipped).
 */
export const partyBaseFilter = (
  companyId: Types.ObjectId | string,
  partyRole: PartyRole,
  query: Record<string, unknown> = {}
): FilterQuery<IUser> => {
  const isDeletedParam = parseBoolQuery(query.isDeleted);
  const isArchiveParam = parseBoolQuery(query.isArchive);
  const viewingHidden = isDeletedParam === true || isArchiveParam === true;

  const filter: FilterQuery<IUser> = {
    companyId,
    role: roleQuery(partyRole),
  };

  const andConditions: FilterQuery<IUser>[] = [];

  if (isDeletedParam === true) {
    filter.isDeleted = true;
  } else if (isArchiveParam !== true) {
    filter.isDeleted = { $ne: true };
  }

  if (isArchiveParam === true) {
    andConditions.push({ "businessProfile.isArchive": true });
  } else if (isDeletedParam !== true) {
    andConditions.push({
      $or: [
        { "businessProfile.isArchive": { $ne: true } },
        { businessProfile: { $exists: false } },
      ],
    });
  }

  if (!viewingHidden) {
    andConditions.push({
      $or: [
        { "businessProfile.active": { $ne: false } },
        { businessProfile: { $exists: false } },
      ],
    });
  }

  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  return filter;
};

/** Base filter for company user list when role is customer or vendor (same as customer/all, vendor/all). */
export const companyPartyListFilter = (
  companyId: Types.ObjectId | string,
  roleParam?: string,
  query: Record<string, unknown> = {}
) => {
  const roleValue = typeof roleParam === "string" ? roleParam.trim() : "";
  if (roleValue === roleEnum.customer || roleValue === "client") {
    return partyBaseFilter(companyId, roleEnum.customer, query);
  }
  if (roleValue === roleEnum.vendor) {
    return partyBaseFilter(companyId, roleEnum.vendor, query);
  }
  return { companyId, isDeleted: false };
};

export const isCompanyPartyListRole = (roleParam?: string) => {
  const roleValue = typeof roleParam === "string" ? roleParam.trim() : "";
  return (
    roleValue === roleEnum.customer ||
    roleValue === "client" ||
    roleValue === roleEnum.vendor
  );
};

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
  registration_number: payload.registration_number,
  tax_number: payload.tax_number,
  business_phone: payload.business_phone,
  fax: payload.fax,
  home_phone: payload.home_phone,
  birthday: payload.birthday ? new Date(payload.birthday) : undefined,
  anniversary: payload.anniversary ? new Date(payload.anniversary) : undefined,
  bank_details: payload.bank_details,
  payment_terms: payload.payment_terms,
  default_tax_service_id: payload.default_tax_service_id
    ? (payload.default_tax_service_id as TBusinessProfile["default_tax_service_id"])
    : undefined,
  default_tax_product_id: payload.default_tax_product_id
    ? (payload.default_tax_product_id as TBusinessProfile["default_tax_product_id"])
    : undefined,
  hourly_rate: payload.hourly_rate,
  opening_balance: payload.opening_balance,
  opening_balance_date: payload.opening_balance_date
    ? new Date(payload.opening_balance_date)
    : undefined,
  payment_reminder: payload.payment_reminder,
  billing_address: payload.billing_address,
  shipping_address: payload.same_as_billing ? payload.billing_address : payload.shipping_address,
  same_as_billing: payload.same_as_billing ?? false,
  notes: payload.notes,
  active: payload.active ?? true,
  isArchive: payload.isArchive ?? false,
});

const resolvePartyLogin = (payload: TPartyUserWrite): boolean => {
  if (typeof payload.login === "boolean") return payload.login;
  return Boolean(payload.password?.trim());
};

export const mapPartyPayloadToUser = (
  payload: TPartyUserWrite,
  companyId: Types.ObjectId | string,
  partyRole: PartyRole
): Partial<IUser> => {
  const canLogin = resolvePartyLogin(payload);
  return {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    designation: payload.designation,
    currency: payload.currency,
    ...(payload.password ? { password: payload.password } : {}),
    role: partyRole,
    companyId: companyId as IUser["companyId"],
    businessProfile: buildProfile(payload),
    isDeleted: payload.isDeleted ?? false,
    isVerify: canLogin,
    login: canLogin,
  };
};

/** Create payload + role permissions from Permission collection (mirrors create-user-by-company). */
export const buildPartyUserForCreate = async (
  payload: TPartyUserWrite,
  companyId: Types.ObjectId | string,
  partyRole: PartyRole
): Promise<Partial<IUser>> => {
  const userData = mapPartyPayloadToUser(payload, companyId, partyRole);
  userData.permissions = await loadStoredRolePermissions(companyId, partyRole);
  return userData;
};

/**
 * Partial update — only the provided keys change. businessProfile fields use dot-notation
 * so a partial edit (or the soft-delete flags) never wipes the rest of the profile.
 */
export const applyPartyUpdateToUser = (payload: TPartyUserWrite): Record<string, unknown> => {
  const update: Record<string, unknown> = {};

  if (payload.name !== undefined) update.name = payload.name;
  if (payload.email !== undefined) update.email = payload.email;
  if (payload.phone !== undefined) update.phone = payload.phone;
  if (payload.designation !== undefined) update.designation = payload.designation;
  if (payload.currency !== undefined) update.currency = payload.currency;
  if (payload.password !== undefined && payload.password.trim()) {
    update.password = payload.password;
    if (payload.login === undefined) update.login = true;
    update.isVerify = true;
  }
  if (payload.login !== undefined) update.login = payload.login;

  const setProfile = (key: keyof TBusinessProfile, value: unknown) => {
    if (value !== undefined) update[`businessProfile.${key}`] = value;
  };
  setProfile("companyName", payload.company_name);
  setProfile("registration_number", payload.registration_number);
  setProfile("tax_number", payload.tax_number);
  setProfile("business_phone", payload.business_phone);
  setProfile("fax", payload.fax);
  setProfile("home_phone", payload.home_phone);
  setProfile("birthday", payload.birthday ? new Date(payload.birthday) : payload.birthday);
  setProfile("anniversary", payload.anniversary ? new Date(payload.anniversary) : payload.anniversary);
  setProfile("bank_details", payload.bank_details);
  setProfile("payment_terms", payload.payment_terms);
  setProfile("default_tax_service_id", payload.default_tax_service_id);
  setProfile("default_tax_product_id", payload.default_tax_product_id);
  setProfile("hourly_rate", payload.hourly_rate);
  setProfile("opening_balance", payload.opening_balance);
  setProfile(
    "opening_balance_date",
    payload.opening_balance_date ? new Date(payload.opening_balance_date) : payload.opening_balance_date
  );
  setProfile("payment_reminder", payload.payment_reminder);
  setProfile("billing_address", payload.billing_address);
  setProfile(
    "shipping_address",
    payload.same_as_billing ? payload.billing_address : payload.shipping_address
  );
  setProfile("same_as_billing", payload.same_as_billing);
  setProfile("notes", payload.notes);
  setProfile("active", payload.active);
  setProfile("isArchive", payload.isArchive);

  if (typeof payload.isDeleted === "boolean") update.isDeleted = payload.isDeleted;
  return update;
};

export const toPartyUserResponse = (user: IUser): IUser => {
  const doc = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete (doc as { password?: string }).password;
  return doc as IUser;
};
