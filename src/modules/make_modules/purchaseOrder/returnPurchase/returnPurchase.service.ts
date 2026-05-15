import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { TReturnPurchase } from "./returnPurchase.interface";
import { ReturnPurchaseModel } from "./returnPurchase.model";
import { PurchaseOrderModel } from "../purchaseOrder.model";
import { WarehouseModel } from "../../warehouse/warehouse.model";

const createReturnPurchaseDB = async (payload: TReturnPurchase) => {
  const purchaseOrder = await PurchaseOrderModel.findById(payload.purchase_order_id);
  if (!purchaseOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "Original Purchase Order not found");
  }
  const warehouse = await WarehouseModel.findById(payload.warehouse_id);
  if (!warehouse) {
    throw new AppError(httpStatus.NOT_FOUND, "Warehouse not found");
  }
  const result = await ReturnPurchaseModel.create(payload);
  return result;
};

const getAllReturnPurchaseDB = async (query: Record<string, unknown>, user_id: string) => {
  const buildQuery = new queryBuilder(
    ReturnPurchaseModel.find({ user_id, isDeleted: false, archive: false })
      .populate("purchase_order_id")
      .populate("warehouse_id"),
    query
  )
    .search(["notes", "return_reason"])
    .filter()
    .sort()
    .fields();

  const { totalData } = await buildQuery.paginate(
    ReturnPurchaseModel.find({ user_id, isDeleted: false, archive: false })
  );

  const allReturns = await buildQuery.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = buildQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });

  return { allReturns, pagination };
};

const getSingleReturnPurchaseDB = async (id: string, user_id: string) => {
  const doc = await ReturnPurchaseModel.findOne({
    _id: id,
    user_id,
    isDeleted: false,
  })
    .populate("purchase_order_id")
    .populate("warehouse_id");

  if (!doc) {
    throw new AppError(httpStatus.NOT_FOUND, "Return purchase not found");
  }
  return doc;
};

const updateReturnPurchaseDB = async (
  id: string,
  user_id: string,
  payload: Partial<TReturnPurchase>
) => {
  const doc = await ReturnPurchaseModel.findOneAndUpdate(
    { _id: id, user_id, isDeleted: false },
    payload,
    { new: true, runValidators: true }
  );
  if (!doc) {
    throw new AppError(httpStatus.NOT_FOUND, "Return purchase not found");
  }
  return doc;
};

const deleteReturnPurchaseDB = async (id: string, user_id: string) => {
  const doc = await ReturnPurchaseModel.findOneAndUpdate(
    { _id: id, user_id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!doc) {
    throw new AppError(httpStatus.NOT_FOUND, "Return purchase not found");
  }
  return doc;
};

export const returnPurchaseService = {
  createReturnPurchaseDB,
  getAllReturnPurchaseDB,
  getSingleReturnPurchaseDB,
  updateReturnPurchaseDB,
  deleteReturnPurchaseDB,
};
