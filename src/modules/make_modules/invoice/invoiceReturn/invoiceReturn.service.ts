import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { TInvoiceReturn } from "./invoiceReturn.interface";
import { InvoiceReturnModel } from "./invoiceReturn.model";
import { InvoiceModel } from "../invoice.model";
import { WarehouseModel } from "../../purchase/warehouse/warehouse.model";
import { createCreditNoteFromInvoiceReturn } from "../../account/noteFromReturn.service";
import { withBulkDeleteId } from "../../../../utils/bulkDelete";

const createInvoiceReturnDB = async (payload: TInvoiceReturn) => {
  const invoice = await InvoiceModel.findById(payload.invoice_id);
  if (!invoice) {
    throw new AppError(httpStatus.NOT_FOUND, "Original Invoice not found");
  }
  // const warehouse = await WarehouseModel.findById(payload.warehouse_id);
  // if (!warehouse) {
  //   throw new AppError(httpStatus.NOT_FOUND, "Warehouse not found");
  // }
  const result = await InvoiceReturnModel.create(payload);
  return result;
};

const getAllInvoiceReturnDB = async (query: Record<string, unknown>, user_id: string) => {
  const buildQuery = new queryBuilder(
    InvoiceReturnModel.find({ user_id, isDeleted: false, isArchive: false }).populate("invoice_id").populate("warehouse_id"),
    query
  )
    .search(["notes", "return_reason"])
    .filter()
    .sort()
    .fields();

  const { totalData } = await buildQuery.paginate(
    InvoiceReturnModel.find({ user_id, isDeleted: false, isArchive: false })
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

const getSingleInvoiceReturnDB = async (id: string, user_id: string) => {
  const invoiceReturn = await InvoiceReturnModel.findOne({
    _id: id,
    user_id,
    isDeleted: false,
  }).populate("invoice_id").populate("warehouse_id")
  
  if (!invoiceReturn) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice Return not found");
  }
  return invoiceReturn;
};

const updateInvoiceReturnDB = async (
  id: string,
  user_id: string,
  payload: Partial<TInvoiceReturn>
) => {
  const invoiceReturn = await InvoiceReturnModel.findOneAndUpdate(
    { _id: id, user_id },
    payload,
    { new: true, runValidators: true }
  );
  if (!invoiceReturn) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice Return not found");
  }
  return invoiceReturn;
};

const deleteInvoiceReturnDBOne = async (id: string, user_id: string) => {
  const invoiceReturn = await InvoiceReturnModel.findOneAndUpdate(
    { _id: id, user_id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!invoiceReturn) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice Return not found");
  }
  return invoiceReturn;
};

/** Approve return → draft credit note (Laravel: ApproveSalesReturn → CreateCreditNoteFromReturn). */
const approveInvoiceReturnDB = async (id: string, user_id: string) => {
  const salesReturn = await InvoiceReturnModel.findOne({ _id: id, user_id, isDeleted: false });
  if (!salesReturn) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice Return not found");
  }
  if (salesReturn.status === "Approved") {
    throw new AppError(httpStatus.BAD_REQUEST, "Sales return is already approved");
  }
  const creditNote = await createCreditNoteFromInvoiceReturn(user_id, salesReturn);
  salesReturn.status = "Approved";
  salesReturn.credit_note_id = creditNote._id;
  await salesReturn.save();
  return { salesReturn, creditNote };
};

const deleteInvoiceReturnDB = withBulkDeleteId(deleteInvoiceReturnDBOne);

export const invoiceReturnService = {
  createInvoiceReturnDB,
  getAllInvoiceReturnDB,
  getSingleInvoiceReturnDB,
  updateInvoiceReturnDB,
  deleteInvoiceReturnDB,
  approveInvoiceReturnDB,
};
