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
  CUSTOMER_ROLE_VALUES,
} from "../../../utils/partyUser";

const customerCreateDB = async (payload: TPartyUserWrite) => {
  const companyId = payload.user_id;
  if (!companyId) {
    throw new AppError(httpStatus.BAD_REQUEST, "user_id (company) is required");
  }
  validatePartyCreateBody(payload, role.customer);
  const userData = mapPartyPayloadToUser(payload, companyId, role.customer);
  const created = await UserModel.create(userData);
  return toPartyUserResponse(created);
};

const allCustomerDB = async (user_id: string, query: Record<string, unknown>) => {
  const baseFilter = partyBaseFilter(user_id, role.customer);
  const customerQuery = new queryBuilder(UserModel.find(baseFilter).select("-password"), query)
    .search([...PARTY_SEARCH_FIELDS])
    .filter()
    .sort()
    .fields();
  const { totalData } = await customerQuery.paginate(
    UserModel.find(baseFilter).select("-password")
  );
  const allCustomer = (await customerQuery.modelQuery.exec()).map(toPartyUserResponse);
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = customerQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });
  return { allCustomer, pagination };
};

const singleCustomerDB = async (user_id: string, _id: string): Promise<IUser | null> => {
  const doc = await UserModel.findOne({
    ...partyBaseFilter(user_id, role.customer),
    _id,
  }).select("-password");
  if (!doc) return null;
  return toPartyUserResponse(doc);
};

const deleteCustomerDB = async (user_id: string, payload: TPartyUserWrite) => {
  const update = applyPartyUpdateToUser({
    ...payload,
    isDeleted: payload.isDeleted ?? true,
    archive: payload.archive ?? true,
    active: false,
  });
  const res = await UserModel.findOneAndUpdate(
    {
      companyId: user_id,
      _id: payload._id,
      role: { $in: [...CUSTOMER_ROLE_VALUES] },
    },
    { $set: update },
    { new: true }
  ).select("-password");
  if (!res) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }
  return toPartyUserResponse(res);
};

const updateCustomerDB = async (user_id: string, payload: TPartyUserWrite) => {
  const update = applyPartyUpdateToUser(payload);
  const res = await UserModel.findOneAndUpdate(
    {
      companyId: user_id,
      _id: payload._id,
      role: { $in: [...CUSTOMER_ROLE_VALUES] },
      isDeleted: false,
    },
    { $set: update },
    { new: true, runValidators: true }
  ).select("-password");
  if (!res) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }
  return toPartyUserResponse(res);
};

export const customerService = {
  customerCreateDB,
  allCustomerDB,
  singleCustomerDB,
  deleteCustomerDB,
  updateCustomerDB,
};
