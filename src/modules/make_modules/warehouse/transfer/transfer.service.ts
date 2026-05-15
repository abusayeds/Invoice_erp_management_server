import mongoose, { Types } from "mongoose";
import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { TStockTransfer } from "./transfer.interface";
import { StockTransferModel } from "./transfer.model";
import { ProductModel } from "../../product/product.model";
import { WarehouseModel } from "../warehouse.model";

const assertPositiveIntegerQuantity = (quantity: unknown): number => {
  const n = Number(quantity);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) {
    throw new AppError(httpStatus.BAD_REQUEST, "quantity must be a positive integer");
  }
  return n;
};

const assertObjectIds = (from: Types.ObjectId | string, to: Types.ObjectId | string) => {
  if (String(from) === String(to)) {
    throw new AppError(httpStatus.BAD_REQUEST, "from_warehouse and to_warehouse must be different");
  }
};

const createTransferDB = async (payload: TStockTransfer) => {
  const user_id = payload.user_id;
  const quantity = assertPositiveIntegerQuantity(payload.quantity);
  assertObjectIds(payload.from_warehouse, payload.to_warehouse);

  const product = await ProductModel.findOne({
    _id: payload.product_id,
    user_id,
    isDeleted: false,
    isArchive: false,
  });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const [fromWh, toWh] = await Promise.all([
    WarehouseModel.findOne({ _id: payload.from_warehouse, user_id, isDeleted: false }),
    WarehouseModel.findOne({ _id: payload.to_warehouse, user_id, isDeleted: false }),
  ]);
  if (!fromWh) {
    throw new AppError(httpStatus.NOT_FOUND, "Source warehouse not found");
  }
  if (!toWh) {
    throw new AppError(httpStatus.NOT_FOUND, "Destination warehouse not found");
  }

  const onHand = product.stock?.onHandStock ?? 0;
  if (onHand < quantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Insufficient product stock: onHandStock is ${onHand}, transfer requests ${quantity}`
    );
  }

  if (!payload.date || Number.isNaN(new Date(payload.date as unknown as string).getTime())) {
    throw new AppError(httpStatus.BAD_REQUEST, "date must be a valid date");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productUpdated = await ProductModel.findOneAndUpdate(
      {
        _id: payload.product_id,
        user_id,
        isDeleted: false,
        isArchive: false,
        "stock.onHandStock": { $gte: quantity },
      },
      { $inc: { "stock.onHandStock": -quantity } },
      { new: true, session }
    );
    if (!productUpdated) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Insufficient stock on product (onHandStock); another request may have updated stock"
      );
    }

    const committed = productUpdated.stock?.committedStock ?? 0;
    const newOnHand = productUpdated.stock?.onHandStock ?? 0;
    const availableForSale = Math.max(0, newOnHand - committed);

    await ProductModel.updateOne(
      { _id: payload.product_id, user_id },
      { $set: { "stock.availableForSale": availableForSale } },
      { session }
    );

    const [transferDoc] = await StockTransferModel.create(
      [
        {
          user_id,
          product_id: payload.product_id,
          from_warehouse: payload.from_warehouse,
          to_warehouse: payload.to_warehouse,
          quantity,
          date: new Date(payload.date),
          notes: payload.notes,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return await StockTransferModel.findById(transferDoc._id)
      .populate("product_id")
      .populate("from_warehouse")
      .populate("to_warehouse");
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getAllTransferDB = async (query: Record<string, unknown>, user_id: string) => {
  const buildQuery = new queryBuilder(
    StockTransferModel.find({ user_id })
      .populate("product_id", "productName sku stock")
      .populate("from_warehouse", "name city")
      .populate("to_warehouse", "name city"),
    query
  )
    .search(["notes"])
    .filter()
    .sort()
    .fields();

  const { totalData } = await buildQuery.paginate(StockTransferModel.find({ user_id }));

  const allTransfers = await buildQuery.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = buildQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });

  return { allTransfers, pagination };
};

const getSingleTransferDB = async (id: string, user_id: string) => {
  const doc = await StockTransferModel.findOne({ _id: id, user_id })
    .populate("product_id")
    .populate("from_warehouse")
    .populate("to_warehouse");
  if (!doc) {
    throw new AppError(httpStatus.NOT_FOUND, "Stock transfer not found");
  }
  return doc;
};

export const transferService = {
  createTransferDB,
  getAllTransferDB,
  getSingleTransferDB,
};
