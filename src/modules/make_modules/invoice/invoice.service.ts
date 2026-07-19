import httpStatus from 'http-status';
import AppError from '../../../errors/AppError';
import { CLIENT_POPULATE_SELECT } from '../../../utils/partyUser';
import { IUser } from '../../basic_modules/user/user.interface';
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
import { withBulkDeleteId } from "../../../utils/bulkDelete";
import { generateInvoiceNumber } from '../../../utils/generateInvoiceNumber';

const createDB = async (payload: TInvoice) => {

  await validateDocumentParties(payload);
  // if (Array.isArray(payload.product)) {
  //   for (const item of payload.product) {
  //     const product = (await ProductModel.findById(item.product_id)) as TProduct;
  //     if (!product) {
  //       throw new AppError(httpStatus.NOT_FOUND, 'Product not found with id: ' + item.product_id);
  //     }
  //     if (product.pricing.sellPrice !== item.rate) {
  //       throw new AppError(httpStatus.BAD_REQUEST, 'Product rate mismatch ' + item.product_id + ': ' + product.pricing.sellPrice + ' vs ' + item.rate);
  //     }
  //     validateItemAmount(item, 'product');
  //   }
  // }

  if (Array.isArray(payload.product)) {
    for (const item of payload.product) {
      // Existing Product
      if (item.product_id) {
        const product = await ProductModel.findById(item.product_id);

        if (!product) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `Product not found with id: ${item.product_id}`
          );
        }

        if (product.pricing.sellPrice !== item.rate) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Product rate mismatch ${item.product_id}: ${product.pricing.sellPrice} vs ${item.rate}`
          );
        }
      }

      // Create Product Automatically
      else {
        const createdProduct = await ProductModel.create({
          user_id: payload.user_id,
          productName: item.product_name,
          quantity: item.quantity,
          pricing: {
            buyPrice: 0,
            buyPriceTax: 0,
            sellPrice: item.rate,
            sellPriceTax: item.tax,
            currency: payload.currency ?? "USD",
          },
          stock: {
            onHandStock: 0,
            committedStock: 0,
            availableForSale: 0,
            toBeInvoiced: 0,
            toBeBilled: 0,
          },
          description: item.description,
        });

        // Assign the newly created product id
        item.product_id = createdProduct._id;
      }

      validateItemAmount(item, "product");
    }
  }


  // if (Array.isArray(payload.service)) {
  //   for (const item of payload.service) {
  //     const service = (await ServiceModel.findById(item.service_id)) as TService;
  //     if (!service) {
  //       throw new AppError(httpStatus.NOT_FOUND, 'Service not found with id: ' + item.service_id);
  //     }
  //     if (service.rate !== item.rate) {
  //       throw new AppError(httpStatus.BAD_REQUEST, 'Service rate mismatch ' + item.service_id + ': ' + service.rate + ' vs ' + item.rate);
  //     }
  //     validateItemAmount(item, 'service');
  //   }
  // }

  if (Array.isArray(payload.service)) {
    for (const item of payload.service) {
      // Existing service
      if (item.service_id) {
        const service = await ServiceModel.findById(item.service_id);

        if (!service) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `Service not found with id: ${item.service_id}`
          );
        }

        if (service.rate !== item.rate) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Service rate mismatch ${item.service_id}: ${service.rate} vs ${item.rate}`
          );
        }
      }

      // Custom service (no service_id)
      else {
        if (!item.service_name) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "service_name is required when service_id is not provided."
          );
        }
      }

      validateItemAmount(item, "service");
    }
  }

  const result = await calculateInvoice(payload);

  const data = {
    ...payload,
    ...result,
    invoice_number: await generateInvoiceNumber("INV")
  };
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
  }).populate({
    path: "product.product_id",
    select: "productName description",
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
    })
      .populate({
        path: "customer_id",
        select: `${CLIENT_POPULATE_SELECT} companyId`,
        populate: {
          path: "companyId",
          select: "name businessProfile.companyName",
          transform: (doc: IUser | null) =>
            doc && {
              _id: doc._id,
              company_name: doc.businessProfile?.companyName ?? doc.name ?? "",
            },
        },
      })
      .populate({
        path: "product.product_id",
        select: "productName description",
      }),
    query
  )
    .search([
      "internal_notes",
      "notes",
      "terms_and_conditions",
      "invoice_number",
      "sub_title",
    ])
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

const deleteDBOne = async (id: string, userId: string) => {
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

const deleteDB = withBulkDeleteId(deleteDBOne);

export const invoiceService = { createDB, getSingleDB, getAllDB, updateDB, deleteDB };


