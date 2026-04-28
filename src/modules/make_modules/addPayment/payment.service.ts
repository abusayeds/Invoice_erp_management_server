import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { CustomerModel } from "../customer/customer.model";
import { TPayment } from "./payment.interface";
import { PaymentModel } from "./payment.model";
import { InvoiceManagementModel } from "../invoiceManagement/invoice.management.model";
import queryBuilder from "../../../builder/queryBuilder";

const paymentCreateDB = async (payload: TPayment) => {
  const customer = await CustomerModel.findById(payload.customer_id);
  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }
  if (payload.type === "invoice") {
    const invoice = await InvoiceManagementModel.findById(payload.invoice_id);
    if (!invoice) {
      throw new AppError(httpStatus.NOT_FOUND, "Invoice not found");
    }
  }
  const result = await PaymentModel.create(payload);
  return result;
};

const paymentGetAllDB = async ( query  :  Record<string, unknown> ,  user_id: string) => {
  const paymentQuery =  new queryBuilder(PaymentModel.find({ user_id, isActive: true , isDeleted: false , isArchive: false }) , query).search(["payment_type" , "notes" , "internal_notes"]).filter().sort().fields()
  const { totalData } = await paymentQuery.paginate(PaymentModel.find({ user_id, isActive: true , isDeleted: false , isArchive: false }))
  const allPayment = await paymentQuery.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = paymentQuery.calculatePagination({ totalData, currentPage, limit });
  return { allPayment, pagination };

};
const paymentSingleDB = async (id: string) => {
  const payment = await PaymentModel.findOne({ _id: id, isActive: true , isDeleted: false , isArchive: false
   }    );
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return payment;
};
const paymentUpdateDB = async (id: string, payload: Partial<TPayment>) => {
  const payment = await PaymentModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return payment;
};
const paymentDeleteDB = async (id: string) => {
  const payment = await PaymentModel.findByIdAndDelete(id);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }
};

export const addPaymentService = {
  paymentCreateDB,
  paymentGetAllDB,
  paymentSingleDB,
  paymentUpdateDB,
  paymentDeleteDB,
};
