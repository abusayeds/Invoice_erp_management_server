import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { CustomerModel } from "../customer/customer.model";
import { TInvoiceManagement } from "./invoice.management.interface";
import { InvoiceManagementModel } from "./invoice.management.model";
import { ProductModel } from "../product/product.model";
import { ServiceModel } from "../service/service.model";

const invoiceManagementCreateDB = async (payload: TInvoiceManagement) => {
  const isCustomerExist = await CustomerModel.findById(payload.customer_id);
  if (!isCustomerExist) {
    throw new AppError(httpStatus.NOT_EXTENDED, "Customer not found");
  }
  for (const item of payload.product) {
    const product = await ProductModel.findById(item.product_id);
    if (!product) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Product not found with id: ${item.product_id}`,
      );
    }
  }
  for (const item of payload.service) {
    const service = await ServiceModel.findById(item.service_id);
    if (!service) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Service not found with id: ${item.service_id}`,
      );
    }
  }
 
  const result = await InvoiceManagementModel.create(payload);
  return result;
};

export const invoiceManagementService = {
  invoiceManagementCreateDB,
};
