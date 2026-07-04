import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { TWarehouse } from "./warehouse.interface";
import { WarehouseModel } from "./warehouse.model";

const createWarehouseDB = async (payload: TWarehouse) => {
  const result = await WarehouseModel.create(payload);
  return result;
};

const getAllWarehouseDB = async (query: Record<string, unknown>, user_id: string) => {
  const base = { user_id, isDeleted: false };
  const buildQuery = new queryBuilder(WarehouseModel.find(base), query)
    .search(["name", "address", "city", "zip_code", "phone", "email"])
    .filter()
    .sort()
    .fields();

  const { totalData } = await buildQuery.paginate(WarehouseModel.find(base));
  const allWarehouse = await buildQuery.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = buildQuery.calculatePagination({ totalData, currentPage, limit });

  return { allWarehouse, pagination };
};

const getSingleWarehouseDB = async (id: string, user_id: string) => {
  const warehouse = await WarehouseModel.findOne({ _id: id, user_id, isDeleted: false });
  if (!warehouse) {
    throw new AppError(httpStatus.NOT_FOUND, "Warehouse not found");
  }
  return warehouse;
};

const updateWarehouseDB = async (id: string, user_id: string, payload: Partial<TWarehouse>) => {
  delete payload.user_id;
  const warehouse = await WarehouseModel.findOneAndUpdate(
    { _id: id, user_id },
    payload,
    { new: true, runValidators: true }
  );
  if (!warehouse) {
    throw new AppError(httpStatus.NOT_FOUND, "Warehouse not found");
  }
  return warehouse;
};

const deleteWarehouseDB = async (id: string, user_id: string) => {
  const warehouse = await WarehouseModel.findOneAndUpdate(
    { _id: id, user_id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!warehouse) {
    throw new AppError(httpStatus.NOT_FOUND, "Warehouse not found");
  }
  return warehouse;
};

export const warehouseService = {
  createWarehouseDB,
  getAllWarehouseDB,
  getSingleWarehouseDB,
  updateWarehouseDB,
  deleteWarehouseDB,
};
