import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { assertVendorUser, CLIENT_POPULATE_SELECT } from "../../../../utils/partyUser";
import {
  companyObjectId,
  companyScope,
  generateAccountNumber,
} from "../account.utils";
import {
  TVendorPayment,
  TVendorPaymentAllocation,
  TDebitNoteApplication,
} from "./vendorPayment.interface";
import { VendorPaymentModel } from "./vendorPayment.model";
import { PurchaseInvoiceModel } from "../../purchase/purchaseInvoice/purchaseInvoice.model";
import { DebitNoteModel } from "../../debitNote/debitNote.model";
import { BankAccountModel } from "../bankAccount/bankAccount.model";
import { createBankTransaction } from "../accountBank.service";

// Purchase invoice payable states (Laravel: a posted invoice is the open/payable one).
const OPEN_STATUSES = ["posted", "partial", "overdue"];

const updateInvoiceBalance = async (
  invoiceId: Types.ObjectId,
  userId: string,
  allocatedAmount: number
) => {
  const invoice = await PurchaseInvoiceModel.findOne({
    _id: invoiceId,
    user_id: userId
  });
  if (!invoice) throw new AppError(httpStatus.BAD_REQUEST, "Invalid purchase invoice in allocation");

  const total = invoice.total ?? 0;
  const paid = (invoice.paid_amount ?? 0) + allocatedAmount;
  let balance = invoice.balance_amount;
  if (balance === undefined || balance === null) {
    balance = total - (invoice.paid_amount ?? 0);
  }
  balance = balance - allocatedAmount;

  invoice.paid_amount = paid;
  invoice.balance_amount = Math.max(0, balance);

  if (invoice.balance_amount <= 0) {
    invoice.status = "paid";
  } else if (invoice.paid_amount > 0) {
    invoice.status = "partial";
  } else {
    invoice.status = "posted";
  }
  await invoice.save();
};

const validateAllocations = async (
  userId: string,
  vendorId: string,
  allocations: TVendorPaymentAllocation[] = [],
  debitNotes: TDebitNoteApplication[] = []
) => {
  let totalAllocated = 0;
  for (const alloc of allocations) {
    const invoice = await PurchaseInvoiceModel.findOne({
      _id: alloc.invoice_id,
      user_id: userId,
      vendor_id: vendorId,
      isDeleted: false,
      status: { $in: OPEN_STATUSES },
    });
    if (!invoice) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Invalid or ineligible purchase invoice for allocation"
      );
    }
    const balance =
      invoice.balance_amount !== undefined && invoice.balance_amount !== null
        ? invoice.balance_amount
        : (invoice.total ?? 0) - (invoice.paid_amount ?? 0);
    if (alloc.allocated_amount > balance + 0.01) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Allocation exceeds purchase invoice balance for ${invoice.invoice_number ?? invoice._id}`
      );
    }
    totalAllocated += alloc.allocated_amount;
  }

  if (debitNotes.length) {
    const totalDebit = debitNotes.reduce((s, d) => s + d.applied_amount, 0);
    if (totalDebit > totalAllocated + 0.01) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Debit note amount cannot exceed total bill allocation amount"
      );
    }
    for (const dn of debitNotes) {
      const note = await DebitNoteModel.findOne({
        _id: dn.debit_note_id,
        user_id: userId,
        vendor_id: vendorId,
        isDeleted: false,
        status: { $in: ["Approved", "Partial", "Open"] },
      });
      if (!note) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid debit note application");
      }
      const noteBalance =
        note.balance_amount !== undefined && note.balance_amount !== null
          ? note.balance_amount
          : (note.total ?? 0) - (note.applied_amount ?? 0);
      if (dn.applied_amount > noteBalance + 0.01) {
        throw new AppError(httpStatus.BAD_REQUEST, "Debit note applied amount exceeds balance");
      }
    }
  }
};

const createDB = async (payload: TVendorPayment) => {
  await assertVendorUser(payload.vendor_id);
  const bank = await BankAccountModel.findOne({
    _id: payload.bank_account_id,
    ...companyScope(String(payload.user_id)),
  });
  if (!bank) throw new AppError(httpStatus.BAD_REQUEST, "Invalid bank account");

  await validateAllocations(
    String(payload.user_id),
    String(payload.vendor_id),
    payload.allocations,
    payload.debit_notes
  );

  payload.payment_number = await generateAccountNumber(
    VendorPaymentModel,
    "VP",
    companyObjectId(payload.user_id),
    "payment_number"
  );
  payload.status = "pending";
  return VendorPaymentModel.create(payload);
};

const getAllDB = async (userId: string, query: Record<string, unknown>) => {
  const base = VendorPaymentModel.find(companyScope(userId))
    .populate("vendor_id", CLIENT_POPULATE_SELECT)
    .populate("bank_account_id", "account_name account_number")
    .populate("allocations.invoice_id", "invoice_number total balance_amount status");
  const build = new queryBuilder(base, query)
    .search(["payment_number", "reference_number", "notes"])
    .filter()
    .sort()
    .fields();
  const { totalData } = await build.paginate(VendorPaymentModel.find(companyScope(userId)));
  const rows = await build.modelQuery.exec();
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  return { rows, pagination: build.calculatePagination({ totalData, currentPage: page, limit }) };
};

const getOutstandingDB = async (userId: string, vendorId: string) => {
  await assertVendorUser(vendorId);
  const invoices = await PurchaseInvoiceModel.find({
    user_id: userId,
    vendor_id: vendorId,
    isDeleted: false,
    status: { $in: OPEN_STATUSES },
    $or: [{ balance_amount: { $gt: 0 } }, { balance_amount: { $exists: false } }],
  })
    .select("_id invoice_number date due_date total paid_amount balance_amount status")
    .lean();

  const normalized = invoices
    .map((invoice) => {
      const balance =
        invoice.balance_amount !== undefined && invoice.balance_amount !== null
          ? invoice.balance_amount
          : (invoice.total ?? 0) - (invoice.paid_amount ?? 0);
      return { ...invoice, balance_amount: balance };
    })
    .filter((invoice) => invoice.balance_amount > 0);

  const debitNotes = await DebitNoteModel.find({
    user_id: userId,
    vendor_id: vendorId,
    isDeleted: false,
    status: { $in: ["Approved", "Partial", "Open"] },
    $or: [{ balance_amount: { $gt: 0 } }, { balance_amount: { $exists: false } }],
  })
    .select("_id invoice_number total applied_amount balance_amount status")
    .lean();

  return { invoices: normalized, debitNotes };
};

const updateStatusDB = async (id: string, userId: string, status: string) => {
  const record = await VendorPaymentModel.findOne({ _id: id, ...companyScope(userId) });
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "Vendor payment not found");

  if (status === "cleared" && record.status !== "cleared") {
    if (record.payment_amount > 0) {
      await createBankTransaction({
        user_id: record.user_id,
        creator_id: record.creator_id,
        bank_account_id: record.bank_account_id,
        transaction_date: record.payment_date,
        transaction_type: "debit",
        reference_number: record.payment_number,
        description: `Vendor payment ${record.payment_number}`,
        amount: record.payment_amount,
        running_balance: 0,
        transaction_status: "cleared",
        reconciliation_status: "unreconciled"
      });
    }

    for (const alloc of record.allocations ?? []) {
      await updateInvoiceBalance(alloc.invoice_id, userId, alloc.allocated_amount);
    }

    for (const dnApp of record.debit_notes ?? []) {
      const note = await DebitNoteModel.findById(dnApp.debit_note_id);
      if (!note) continue;
      note.applied_amount = (note.applied_amount ?? 0) + dnApp.applied_amount;
      const total = note.total ?? 0;
      note.balance_amount = Math.max(0, total - note.applied_amount);
      if (note.balance_amount <= 0) {
        note.status = "Applied";
      } else {
        note.status = "Partial";
      }
      await note.save();
    }
  }

  record.status = status as TVendorPayment["status"];
  await record.save();
  return record;
};

const deleteDB = async (id: string, userId: string) => {
  const record = await VendorPaymentModel.findOne({ _id: id, ...companyScope(userId) });
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "Vendor payment not found");
  if (record.status !== "pending") {
    throw new AppError(httpStatus.BAD_REQUEST, "Only pending payments can be deleted");
  }
  record.isDeleted = true;
  await record.save();
  return record;
};

export const vendorPaymentService = {
  createDB,
  getAllDB,
  getOutstandingDB,
  updateStatusDB,
  deleteDB,
};
