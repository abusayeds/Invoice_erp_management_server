
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { CustomerModel } from "../customer/customer.model";
import {
  InvoiceManagementType,
  TInvoiceManagement,
} from "./invoice.management.interface";
import { ProductModel } from "../product/product.model";
import { ServiceModel } from "../service/service.model";
import { TProduct } from "../product/product.interface";
import { TService } from "../service/service.interface";
import { calculateInvoice } from "./calculateInvoice";
import { validateItemAmount } from "./validateItemAmount";
import { InvoiceManagementModel } from "./invoice.management.model";
import queryBuilder from "../../../builder/queryBuilder";

const invoiceManagementCreateDB = async (payload: TInvoiceManagement) => {
  const isCustomerExist = await CustomerModel.findById(payload.customer_id);
  if (!isCustomerExist) {
    throw new AppError(httpStatus.NOT_EXTENDED, "Customer not found");
  }
  const allowedTypes = Object.values(InvoiceManagementType);
  if (!payload.type) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invoice type is required. Allowed types: ${allowedTypes.join(", ")}`,
    );
  }
  if (!allowedTypes.includes(payload.type)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid invoice type. Allowed types: ${allowedTypes.join(", ")}`,
    );
  }
  if (Array.isArray(payload.product)) {
    for (const item of payload.product) {
      const product = (await ProductModel.findById(
        item.product_id,
      )) as TProduct;
      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product not found with id: ${item.product_id}`,
        );
      }
      if (product.pricing.sellPrice !== item.rate) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Product rate mismatch ${item.product_id}: ${product.pricing.sellPrice} vs ${item.rate}`,
        );
      }
      validateItemAmount(item, "product");
    }
  }
  if (Array.isArray(payload.service)) {
    for (const item of payload.service) {
      const service = (await ServiceModel.findById(
        item.service_id,
      )) as TService;
      if (!service) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Service not found with id: ${item.service_id}`,
        );
      }
      if (service.rate !== item.rate) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Service rate mismatch ${item.service_id}:  ${service.rate} vs ${item.rate}`,
        );
      }
      validateItemAmount(item, "service");
    }
  }

  const result = await calculateInvoice(payload);
  const invoiceData = {
    ...payload,
    ...result,
  };
  const createdInvoice = await InvoiceManagementModel.create(invoiceData);
  return createdInvoice;
};


const invoiceManagementGetSingleDB = async (id: string, userId: string) => {
  const invoice = await InvoiceManagementModel.findOne({
    _id: id,
    user_id: userId,
    archive: false,
    isDeleted: false,
  });
  if (!invoice) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice not found");
  }
  return invoice;
};
const invoiceManagementGetAllDB = async (
  query: Record<string, unknown>,
  user_id: string,
  type: string,
) => {
  const invoicesQuery = new queryBuilder(
    InvoiceManagementModel.find({
      type,
      user_id: user_id,
      archive: false,
      isDeleted: false,
    }).populate({
      path: "customer_id",
      select: "firstName lastName",
    }),
    query,
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
  const { totalData } = await invoicesQuery.paginate(
    InvoiceManagementModel.find({
      type,
      user_id: user_id,
      archive: false,
      isDeleted: false,
    }),
  );
  const allInvoice = await invoicesQuery.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = invoicesQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });
  return { allInvoice, pagination };
};

export const invoiceManagementService = {
  invoiceManagementCreateDB,
  invoiceManagementGetSingleDB,
  invoiceManagementGetAllDB,
};
