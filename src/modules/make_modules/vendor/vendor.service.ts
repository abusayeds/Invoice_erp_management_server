import httpStatus from "http-status";
import queryBuilder from "../../../builder/queryBuilder";
import { TPartyUserWrite } from "../../basic_modules/user/user.business.interface";
import { IUser } from "../../basic_modules/user/user.interface";
import { UserModel } from "../../basic_modules/user/user.model";
import AppError from "../../../errors/AppError";
import {
  mapPartyPayloadToUser,
  validatePartyCreateBody,
  applyPartyUpdateToUser,
  partyBaseFilter,
  PARTY_SEARCH_FIELDS,
  role,
  toPartyUserResponse,
} from "../../../utils/partyUser";

const vendorCreateDB = async (payload: TPartyUserWrite) => {
  const companyId = payload.user_id;
  if (!companyId) {
    throw new AppError(httpStatus.BAD_REQUEST, "user_id (company) is required");
  }
  validatePartyCreateBody(payload);
  const userData = mapPartyPayloadToUser(payload, companyId, role.vendor);
  const created = await UserModel.create(userData);
  return toPartyUserResponse(created);
};

const allVendorDB = async (user_id: string, query: Record<string, unknown>) => {
  const baseFilter = partyBaseFilter(user_id, role.vendor);
  const vendorQuery = new queryBuilder(UserModel.find(baseFilter).select("-password"), query)
    .search([...PARTY_SEARCH_FIELDS])
    .filter()
    .sort();
  const { totalData } = await vendorQuery.paginate(
    UserModel.find(baseFilter).select("-password")
  );
  const allVendor = (await vendorQuery.modelQuery.exec()).map(toPartyUserResponse);
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = vendorQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });
  return { allVendor, pagination };
};

const singleVendorDB = async (user_id: string, _id: string): Promise<IUser | null> => {
  const doc = await UserModel.findOne({
    ...partyBaseFilter(user_id, role.vendor),
    _id,
  }).select("-password");
  if (!doc) return null;
  return toPartyUserResponse(doc);
};

const deleteVendorDB = async (user_id: string, payload: TPartyUserWrite) => {
  const update = applyPartyUpdateToUser({
    ...payload,
    isDeleted: payload.isDeleted ?? true,
    archive: payload.archive ?? true,
    active: false,
  });
  const res = await UserModel.findOneAndUpdate(
    { companyId: user_id, _id: payload._id, role: role.vendor },
    { $set: update },
    { new: true }
  ).select("-password");
  if (!res) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return toPartyUserResponse(res);
};

const updateVendorDB = async (user_id: string, payload: TPartyUserWrite) => {
  const update = applyPartyUpdateToUser(payload);
  const res = await UserModel.findOneAndUpdate(
    { companyId: user_id, _id: payload._id, role: role.vendor, isDeleted: false },
    { $set: update },
    { new: true, runValidators: true }
  ).select("-password");
  if (!res) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return toPartyUserResponse(res);
};

export const vendorService = {
  vendorCreateDB,
  allVendorDB,
  singleVendorDB,
  deleteVendorDB,
  updateVendorDB,
};
