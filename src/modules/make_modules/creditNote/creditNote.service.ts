import httpStatus from 'http-status';
import AppError from '../../../errors/AppError';
import { CLIENT_POPULATE_SELECT } from '../../../utils/partyUser';
import { validateDocumentParties } from '../../../utils/documentPartyValidation';
import { TCreditNote } from './creditNote.interface';
import { ProductModel } from '../product/product.model';
import { ServiceModel } from '../service/service.model';
import { TProduct } from '../product/product.interface';
import { TService } from '../service/service.interface';
import { calculateInvoice } from '../utils/calculateInvoice';
import { validateItemAmount } from '../utils/validateItemAmount';
import { CreditNoteModel } from './creditNote.model';
import queryBuilder from '../../../builder/queryBuilder';
import { withBulkDeleteId } from "../../../utils/bulkDelete";

const createDB = async (payload: TCreditNote) => {
  await validateDocumentParties(payload);
  const fromReturn = payload.source === "return";
  if (!fromReturn && Array.isArray(payload.product)) {
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
  if (!fromReturn && Array.isArray(payload.service)) {
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
  data.source = data.source ?? "manual";
  data.applied_amount = data.applied_amount ?? 0;
  data.balance_amount = data.balance_amount ?? data.total ?? 0;
  const createdRecord = await CreditNoteModel.create(data);
  return createdRecord;
};

const approveDB = async (id: string, userId: string) => {
  const record = await CreditNoteModel.findOne({
    _id: id,
    user_id: userId,
    isDeleted: false,
  });
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "Credit note not found");
  if (record.status !== "Draft") {
    throw new AppError(httpStatus.BAD_REQUEST, "Only draft credit notes can be approved");
  }
  record.status = "Approved";
  const total = record.total ?? 0;
  if (record.balance_amount === undefined || record.balance_amount === null) {
    record.balance_amount = total - (record.applied_amount ?? 0);
  }
  await record.save();
  return record;
};

const deleteDraftDBOne = async (id: string, userId: string) => {
  const record = await CreditNoteModel.findOne({ _id: id, user_id: userId, isDeleted: false });
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "Credit note not found");
  if (record.status !== "Draft") {
    throw new AppError(httpStatus.BAD_REQUEST, "Only draft credit notes can be deleted");
  }
  record.isDeleted = true;
  await record.save();
  return record;
};

const getSingleDB = async (id: string, userId: string) => {
  const record = await CreditNoteModel.findOne({
    _id: id,
    user_id: userId,
    isArchive: false,
    isDeleted: false,
  });
  if (!record) {
    throw new AppError(httpStatus.NOT_FOUND, 'CreditNote not found');
  }
  return record;
};

const getAllDB = async (query: Record<string, unknown>, user_id: string) => {
  const buildQuery = new queryBuilder(
    CreditNoteModel.find({
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
    CreditNoteModel.find({
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

const deleteDraftDB = withBulkDeleteId(deleteDraftDBOne);

export const creditNoteService = { createDB, getSingleDB, getAllDB, approveDB, deleteDraftDB };


