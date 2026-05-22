import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../errors/AppError";
import { UserModel } from "../modules/basic_modules/user/user.model";
import { IUser } from "../modules/basic_modules/user/user.interface";
import {
  TBusinessProfile,
  TPartyUserWrite,
} from "../modules/basic_modules/user/user.business.interface";
import { role as roleEnum, CUSTOMER_ROLE_VALUES, isCustomerRole } from "./role";
export { roleEnum as role, isCustomerRole, CUSTOMER_ROLE_VALUES };

const MIN_PARTY_PASSWORD_LENGTH = 3;

/** Customer/vendor create — password from frontend is required */
export const validatePartyCreateBody = (payload: TPartyUserWrite) => {
  if (!payload.email?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  }
  const password = payload.password?.trim();
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }
  if (password.length < MIN_PARTY_PASSWORD_LENGTH) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Password must be at least ${MIN_PARTY_PASSWORD_LENGTH} characters`
    );
  }
  if (
    payload.confirmPassword !== undefined &&
    payload.confirmPassword !== "" &&
    password !== payload.confirmPassword
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password and confirm password do not match");
  }
};

export const PARTY_SEARCH_FIELDS = [
  "name",
  "email",
  "phone",
  "businessProfile.companyName",
  "businessProfile.firstName",
  "businessProfile.lastName",
  "businessProfile.BusinessPhone",
  "businessProfile.fax",
  "businessProfile.bank_details",
  "businessProfile.currency",
  "businessProfile.tax_service",
  "businessProfile.tax_product",
] as const;

export const CLIENT_POPULATE_SELECT =
  "name email phone currency role companyId businessProfile";

const roleQuery = (partyRole: typeof roleEnum.customer | typeof roleEnum.vendor) => {
  if (partyRole === roleEnum.customer) {
    return { $in: [...CUSTOMER_ROLE_VALUES] };
  }
  return partyRole;
};

export const partyBaseFilter = (
  companyId: Types.ObjectId | string,
  partyRole: typeof roleEnum.customer | typeof roleEnum.vendor
) => ({
  companyId,
  role: roleQuery(partyRole),
  isDeleted: false,
  "businessProfile.active": true,
  "businessProfile.archive": false,
});

export const assertPartyUser = async (
  id: Types.ObjectId | string,
  partyRole: typeof roleEnum.customer | typeof roleEnum.vendor,
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

const flatToProfile = (payload: TPartyUserWrite): Partial<TBusinessProfile> => ({
  companyName: payload.companyName ?? payload.businessProfile?.companyName,
  reg_no: payload.reg_no ?? payload.businessProfile?.reg_no,
  tax_id: payload.tax_id ?? payload.businessProfile?.tax_id,
  firstName: payload.firstName ?? payload.businessProfile?.firstName,
  lastName: payload.lastName ?? payload.businessProfile?.lastName,
  BusinessPhone: payload.BusinessPhone ?? payload.businessProfile?.BusinessPhone,
  fax: payload.fax ?? payload.businessProfile?.fax,
  mobile: payload.mobile ?? payload.businessProfile?.mobile,
  home_phone: payload.home_phone ?? payload.businessProfile?.home_phone,
  address: payload.businessProfile?.address ?? payload.address,
  billingAddress: payload.billingAddress ?? payload.businessProfile?.billingAddress,
  bank_details: payload.bank_details ?? payload.businessProfile?.bank_details,
  tax_service: payload.tax_service ?? payload.businessProfile?.tax_service,
  tax_product: payload.tax_product ?? payload.businessProfile?.tax_product,
  hourly_rate: payload.hourly_rate ?? payload.businessProfile?.hourly_rate,
  payment_terms_seles:
    payload.payment_terms_seles ?? payload.businessProfile?.payment_terms_seles,
  opening_balance: payload.opening_balance ?? payload.businessProfile?.opening_balance ?? 0,
  opening_balance_date:
    payload.opening_balance_date ?? payload.businessProfile?.opening_balance_date,
  notes: payload.notes ?? payload.businessProfile?.notes,
  payment_reminder:
    payload.payment_reminder ?? payload.businessProfile?.payment_reminder ?? false,
  active: payload.active ?? payload.businessProfile?.active ?? true,
  archive: payload.archive ?? payload.businessProfile?.archive ?? false,
});

export const mapPartyPayloadToUser = (
  payload: TPartyUserWrite,
  companyId: Types.ObjectId | string,
  partyRole: typeof roleEnum.customer | typeof roleEnum.vendor
): Partial<IUser> => {
  const profile = flatToProfile(payload);
  const displayName =
    payload.name ||
    profile.companyName ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
    payload.email;

  return {
    name: displayName,
    email: payload.email!,
    phone: payload.phone || payload.mobile || profile.BusinessPhone || profile.home_phone,
    currency: payload.currency,
    country: payload.country || profile.address?.country,
    role: partyRole,
    companyId: companyId as IUser["companyId"],
    businessProfile: profile,
    password: payload.password!.trim(),
    isDeleted: payload.isDeleted ?? false,
    isVerify: false,
    login: true,
  };
};

export const applyPartyUpdateToUser = (payload: TPartyUserWrite): Partial<IUser> => {
  const update: Partial<IUser> = {};
  if (payload.password?.trim()) {
    if (payload.password.trim().length < MIN_PARTY_PASSWORD_LENGTH) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Password must be at least ${MIN_PARTY_PASSWORD_LENGTH} characters`
      );
    }
    if (
      payload.confirmPassword !== undefined &&
      payload.confirmPassword !== "" &&
      payload.password !== payload.confirmPassword
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, "Password and confirm password do not match");
    }
    update.password = payload.password.trim();
  }
  if (payload.email) update.email = payload.email;
  if (payload.currency) update.currency = payload.currency;
  const profile = flatToProfile(payload);
  if (payload.name || profile.companyName || profile.firstName || profile.lastName) {
    update.name =
      payload.name ||
      profile.companyName ||
      [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
  }
  if (payload.phone || payload.mobile || profile.BusinessPhone) {
    update.phone = payload.phone || payload.mobile || profile.BusinessPhone;
  }
  if (Object.keys(profile).some((k) => profile[k as keyof TBusinessProfile] !== undefined)) {
    update.businessProfile = profile;
  }
  if (typeof payload.isDeleted === "boolean") update.isDeleted = payload.isDeleted;
  return update;
};

export const toPartyUserResponse = (user: IUser): IUser => {
  const doc = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete (doc as { password?: string }).password;
  return doc as IUser;
};

/** @deprecated use mapPartyPayloadToUser with role.customer */
export const mapCustomerPayloadToUser = (payload: TPartyUserWrite, companyId: Types.ObjectId | string) =>
  mapPartyPayloadToUser(payload, companyId, roleEnum.customer);

/** @deprecated use mapPartyPayloadToUser with role.vendor */
export const mapVendorPayloadToUser = (payload: TPartyUserWrite, companyId: Types.ObjectId | string) =>
  mapPartyPayloadToUser(payload, companyId, roleEnum.vendor);

/** @deprecated use applyPartyUpdateToUser */
export const applyCustomerUpdateToUser = applyPartyUpdateToUser;
export const applyVendorUpdateToUser = applyPartyUpdateToUser;
