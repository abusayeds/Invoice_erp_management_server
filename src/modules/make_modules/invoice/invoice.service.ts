import httpStatus from 'http-status';
import AppError from '../../../errors/AppError';
import { CLIENT_POPULATE_SELECT } from '../../../utils/partyUser';
import { validateDocumentParties } from '../../../utils/documentPartyValidation';
import { TInvoice } from './invoice.interface';
import { ProductModel } from '../product/product.model';
import { ServiceModel } from '../service/service.model';
import { TProduct } from '../product/product.interface';
import { TService } from '../service/service.interface';
import { calculateInvoice } from '../utils/calculateInvoice';
import { validateItemAmount } from '../utils/validateItemAmount';
import { InvoiceModel } from './invoice.model';
import queryBuilder from '../../../builder/queryBuilder';

const createDB = async (payload: TInvoice) => {

  await validateDocumentParties(payload);
  if (Array.isArray(payload.product)) {
    for (const item of payload.product) {
      const product = (await ProductModel.findById(item.product_id)) as TProduct;
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found with id: ' + item.product_id);
      }
      if (product.pricing.sellPrice !== item.rate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Product rate mismatch ' + item.product_id + ': ' + product.pricing.sellPrice + ' vs ' + item.rate);
      }
      validateItemAmount(item, 'product');
    }
  }
  if (Array.isArray(payload.service)) {
    for (const item of payload.service) {
      const service = (await ServiceModel.findById(item.service_id)) as TService;
      if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, 'Service not found with id: ' + item.service_id);
      }
      if (service.rate !== item.rate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Service rate mismatch ' + item.service_id + ': ' + service.rate + ' vs ' + item.rate);
      }
      validateItemAmount(item, 'service');
    }
  }
  const result = await calculateInvoice(payload);
  const data = { ...payload, ...result };
  data.paid_amount = data.paid_amount ?? 0;
  data.balance_amount = data.balance_amount ?? data.total ?? 0;
  const createdRecord = await InvoiceModel.create(data);
  return createdRecord;
};

const getSingleDB = async (id: string, userId: string) => {
  const record = await InvoiceModel.findOne({
    _id: id,
    user_id: userId,
    isArchive: false,
    isDeleted: false,
  });
  if (!record) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found');
  }
  return record;
};

const getAllDB = async (query: Record<string, unknown>, user_id: string) => {
  const buildQuery = new queryBuilder(
    InvoiceModel.find({
      user_id: user_id,
      isArchive: false,
      isDeleted: false,
    }).populate({
      path: 'customer_id',
      select: CLIENT_POPULATE_SELECT,
    }),
    query
  )
    .search(['internal_notes', 'notes', 'terms_and_conditions', 'invoice_number', 'sub_title'])
    .filter()
    .sort()
    .fields();
  const { totalData } = await buildQuery.paginate(
    InvoiceModel.find({
      user_id: user_id,
      isArchive: false,
      isDeleted: false,
    })
  );
  const allRecords = await buildQuery.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = buildQuery.calculatePagination({ totalData, currentPage, limit });
  return { allRecords, pagination };
};

const updateDB = async (id: string, userId: string, payload: TInvoice) => {
  const existing = await InvoiceModel.findOne({
    _id: id,
    user_id: userId
  });
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  await validateDocumentParties(payload);
  if (Array.isArray(payload.product)) {
    for (const item of payload.product) {
      const product = (await ProductModel.findById(item.product_id)) as TProduct;
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found with id: ' + item.product_id);
      }
      if (product.pricing.sellPrice !== item.rate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Product rate mismatch ' + item.product_id + ': ' + product.pricing.sellPrice + ' vs ' + item.rate);
      }
      validateItemAmount(item, 'product');
    }
  }
  if (Array.isArray(payload.service)) {
    for (const item of payload.service) {
      const service = (await ServiceModel.findById(item.service_id)) as TService;
      if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, 'Service not found with id: ' + item.service_id);
      }
      if (service.rate !== item.rate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Service rate mismatch ' + item.service_id + ': ' + service.rate + ' vs ' + item.rate);
      }
      validateItemAmount(item, 'service');
    }
  }

  // Only recompute the money fields when the items actually change. A partial update
  // (e.g. just flipping status to "Open") must NOT wipe sub_total/total/balance.
  const recalcTotals = payload.product !== undefined || payload.service !== undefined;

  let data: Record<string, unknown> = { ...payload };
  if (recalcTotals) {
    const result = await calculateInvoice({ ...existing.toObject(), ...payload });
    const paid = payload.paid_amount ?? existing.paid_amount ?? 0;
    data = {
      ...payload,
      ...result,
      paid_amount: paid,
      balance_amount: Math.max(0, (result.total ?? 0) - paid)
    };
  }

  const updatedRecord = await InvoiceModel.findOneAndUpdate(
    { _id: id, user_id: userId },
    data,
    { new: true, runValidators: true }
  );
  return updatedRecord;
};

const deleteDB = async (id: string, userId: string) => {
  const deletedRecord = await InvoiceModel.findOneAndUpdate(
    { _id: id, user_id: userId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!deletedRecord) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found');
  }
  return deletedRecord;
};

export const invoiceService = { createDB, getSingleDB, getAllDB, updateDB, deleteDB };


